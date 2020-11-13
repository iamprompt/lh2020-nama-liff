<template>
  <div class="container">
    <CBox
      w="100vw"
      min-h="100vh"
      bg="#f2f2f2"
      d="flex"
      justify-content="center"
      align-items="center"
      flex-dir="column"
      text-align="center"
    >
      <div>
        <CHeading color="#4F4F4F">{{ title }}</CHeading>

        <c-image
          v-if="isLoaded"
          w="14rem"
          mt="3rem"
          mx="auto"
          :src="require('~/assets/images/icons/GCal.svg')"
        />
        <c-image
          v-else
          mt="3rem"
          mx="auto"
          :src="require('~/assets/images/nama_loader.png')"
        />

        <CText v-if="isLoaded" font-size="1.5rem" mt="3rem">
          เพิ่มนัดลงใน Google Calendar<br />สำเร็จแล้ว
        </CText>
      </div>

      <CBox position="fixed" w="100%" p="1rem" bottom="0">
        <CGrid v-if="isLoaded" template-columns="auto" row-gap="15px">
          <CBox>
            <CButton
              bg="#FFFFFF"
              color="#4258F4"
              variant="solid"
              size="lg"
              rounded="12px"
              w="100%"
              shadow="0px 1px 4px 0px rgba(0, 0, 0, .06)"
              @click="goGCal"
            >
              ไปที่ Google Calendar
            </CButton>
          </CBox>

          <CBox>
            <CButton
              bg="#00B900"
              color="#ffffff"
              variant="solid"
              size="lg"
              rounded="12px"
              w="100%"
              @click="goBackLine"
            >
              กลับไปที่ไลน์
            </CButton>
          </CBox>
        </CGrid>
      </CBox>
    </CBox>
  </div>
</template>

<script lang="ts">
import liff from '@line/liff'
import Vue from 'vue'
import firebase from 'firebase'
import { groupApi, authApi } from '~/utils/api'

declare const gapi: any

export default Vue.extend({
  data() {
    return {
      event: {},
      isLoaded: false,
    }
  },
  computed: {
    title(): string {
      return this.isLoaded
        ? 'เพิ่มลงในปฎิทินให้แล้วน้า'
        : 'กำลังเพิ่มข้อมูลในปฏิทิน...'
    },
  },
  mounted() {
    this.initProviders().then(async () => {
      // Do Google Sign In
      await this.googleSignin()
      // Add Event to calendar
      await this.createEventonCalendar()
      this.isLoaded = true
    })
  },
  methods: {
    async initProviders() {
      // Initialize LIFF
      await liff.init({ liffId: '1655194495-7AEALMp8' })
      // Load Client:auth2
      await gapi.load('client:auth2')
      // Initialize GAPIs
      await gapi.client.int({
        apiKey: process.env.FIREBASE_API_KEY,
        clientId: process.env.GCP_CLIENTID,
        discoveryDocs: [
          'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
        ],
        scope: 'https://www.googleapis.com/auth/calendar',
      })
    },

    async fetchData() {
      const groupId = this.$route.query.groupId
      const getEventDetail = await this.$axios.get(
        // @ts-expect-error
        groupApi(groupId).getEventDetail()
      )

      return getEventDetail.data.data
    },
    async createEventonCalendar() {
      // Sample: Group ID
      // Cb34ad23b226c50f08c67308a3e75955a
      const rawEvent: any = await this.fetchData()
      const calEvent = {
        summary: rawEvent.eventName,
        location: rawEvent.eventLocation,
        start: {
          dateTime: this.$dayjs.unix(rawEvent.eventDateTime._seconds).format(),
          timeZone: 'Asia/Bangkok',
        },
        end: {
          dateTime: this.$dayjs
            .unix(rawEvent.eventDateTime._seconds)
            .add(1, 'hour')
            .format(),
          timeZone: 'Asia/Bangkok',
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 10 },
          ],
        },
      }
      console.log(calEvent)

      const request = gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: calEvent,
      })

      request.execute(function (event: any) {
        console.log('Event created: ' + event.htmlLink)
      })
    },
    firebaseSignin(googleCredential: firebase.auth.OAuthCredential) {
      if (!this.$fire.auth.currentUser) {
        this.$fire.auth.signInWithCredential(googleCredential)
      } else {
        this.$fire.auth.currentUser
          ?.linkWithCredential(googleCredential)
          .then((r) => {
            console.log(r)
          })
          .catch((error: any) => {
            // Handle Errors here.
            console.log(error)
          })
      }
    },
    async googleSignin() {
      const googleUser = gapi.auth2.getAuthInstance()
      console.log(googleUser.isSignedIn.get())

      let currentUser
      if (!googleUser.isSignedIn.get()) {
        currentUser = await gapi.auth2
          .getAuthInstance()
          .signIn(/* { ux_mode: 'redirect' } */)
      } else {
        currentUser = googleUser.currentUser.get()
      }
      const token = currentUser.getAuthResponse().id_token

      const credential = this.$fireModule.auth.GoogleAuthProvider.credential(
        token
      )
      this.firebaseSignin(credential)
    },

    goGCal() {
      window.open('https://calendar.google.com')
    },
    goBackLine() {
      window.location.href = 'https://line.me/R/'
    },
  },
})
</script>
