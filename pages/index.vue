<template>
  <div class="container">
    <CBox
      d="flex"
      w="100vw"
      h="100vh"
      flex-dir="column"
      justify-content="center"
    >
      <CHeading text-align="center" mb="4">
        ⚡️ Welcome to NAMA | THE ASSISTANT BOT ⚡️
      </CHeading>

      <CButton variant-color="green">LINE LOGIN</CButton>
      <CButton variant-color="green" @click="googleSignin"
        >Google LOGIN</CButton
      >
    </CBox>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import liff from '@line/liff'
import { authApi } from '~/utils/api'

declare const gapi: any

require('dotenv').config()

export default Vue.extend({
  data() {
    return {}
  },
  mounted() {
    liff.init({ liffId: '1655194495-1azOVWld' }).then(async () => {
      if (liff.isLoggedIn()) {
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
              .then(async (r) => {
                console.log(r)
                gapi.load('client', () => {
                  console.log('loaded client')

                  gapi.client.init({
                    apiKey: process.env.FIREBASE_API_KEY,
                    clientId: process.env.GCP_CLIENTID,
                    discoveryDocs: [
                      'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest',
                    ],
                    scope: 'https://www.googleapis.com/auth/calendar',
                  })
                })

                const events = await gapi.client.calendar.events.list({
                  calendarId: 'primary',
                  timeMin: new Date().toISOString(),
                  showDeleted: false,
                  singleEvent: true,
                  maxResults: 10,
                  orderBy: 'startTime',
                })
                console.log(events)
              })
              .catch((error: any) => {
                // Handle Errors here.
                console.log(error)
              })
          })
      } else {
        console.log('Not Login')

        // liff.login()
      }
    })
  },
  methods: {
    googleSignin() {
      const googleProvider = new this.$fireModule.auth.GoogleAuthProvider()
      googleProvider.addScope('https://www.googleapis.com/auth/calendar')
      this.$fire.auth.currentUser
        ?.linkWithRedirect(googleProvider)
        .then((r) => {
          console.log(r)
        })
        .catch((error: any) => {
          // Handle Errors here.
          console.log(error)
        })
    },
  },
})
</script>
