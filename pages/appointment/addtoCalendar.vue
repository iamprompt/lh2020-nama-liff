<template>
  <div class="container">
    <CBox bg="#f2f2f2" w="100ve" min-h="100vh"></CBox>
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
    }
  },
  mounted() {
    liff.init({ liffId: '1655194495-7AEALMp8' }).then(async () => {
      /* if (liff.isLoggedIn()) {
        console.log('Login')
        const LINEprofile = await liff.getProfile()
        const LINEemail = await liff.getDecodedIDToken()?.email
        await this.$axios
          .$post(
            authApi().createCustomToken(),
            {
              access_token: liff.getAccessToken(),
              id: LINEprofile.userId,
              displayName: LINEprofile.displayName,
              pictureUrl: LINEprofile.pictureUrl,
              email: LINEemail,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
          .then((res: any) => {
            console.log(res)

            this.$fire.auth
              .signInWithCustomToken(res.firebase_token)
              .then((r) => {
                console.log(r)
              })
              .catch((error: any) => {
                // Handle Errors here.
                console.log(error)
              })
          }) */

      await gapi.load('client:auth2', async () => {
        console.log('loaded client')
        await gapi.client
          .init({
            apiKey: process.env.FIREBASE_API_KEY,
            clientId: process.env.GCP_CLIENTID,
            discoveryDocs: [
              'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
            ],
            scope: 'https://www.googleapis.com/auth/calendar',
          })
          .then(async () => {
            await this.googleSignin()
            await this.createEventonCalendar()
          })
      })
      /* } else {
        console.log('Not Login')

        liff.login({
          redirectUri: `${window.location.href}`,
        })
      } */
    })
  },
  methods: {
    async fetchData() {
      const groupId = this.$route.query.groupId
      const getEventDetail = await this.$axios.get(
        // @ts-expect-error
        groupApi(groupId).getEventDetailWId()
      )

      return getEventDetail.data.data
    },
    async createEventonCalendar() {
      // const getEventDetail = await this.$axios.get(
      //   groupApi('Cb34ad23b226c50f08c67308a3e75955a').getEventDetailWId()
      // )
      // console.log(getEventDetail.data.data)

      // const rawEvent = getEventDetail.data.data
      const rawEvent: any = await this.fetchData()
      const calEvent = {
        // id: rawEvent.eventId,
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
      // const googleProvider = new this.$fireModule.auth.GoogleAuthProvider()
      // googleProvider.addScope('https://www.googleapis.com/auth/calendar')
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
  },
})
</script>
