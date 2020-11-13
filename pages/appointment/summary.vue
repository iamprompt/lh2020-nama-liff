<template>
  <div class="container">
    <CBox
      d="flex"
      flex-dir="column"
      justify-items="center"
      w="100vw"
      min-h="100vh"
      bg="#f2f2f2"
      p="5"
      pt="90px"
    >
      <CHeading font-size="xl" font-weight="bold" mb="5" align-self="end">
        รายละเอียดการนัดหมาย
      </CHeading>

      <CBox
        d="flex"
        flex-dir="column"
        w="100%"
        bg="white"
        color="black"
        mb="3"
        rounded="12px"
        box-shadow="0px 5px 20px rgba(0, 0, 0, 0.08);"
        z-index="0"
      >
        <CBox
          w="100%"
          p="4"
          background="linear-gradient(17.62deg, #F06129 14.28%, #FF9A3D 86.61%);"
          color="white"
          rounded-top="12px"
          pos="relative"
        >
          <CText font-size="x-large" font-weight="bold">
            {{ eventDetail.eventName }}
          </CText>
          <CImage
            :src="require(`~/assets/images/shiba/shiba_create_header.svg`)"
            pos="absolute"
            justify-self="end"
            right="10px"
            top="-92px"
            w="100px"
            h="100px"
          />
        </CBox>

        <!-- Event Detail -->
        <CBox p="4" class="forms">
          <CGrid
            template-columns="30% 70%"
            gap="15px"
            mb="3"
            mr="4"
            font-size="lg"
            pos="relative"
          >
            <!-- Date -->
            <CText color="#828282" mt="2" mb="2">วันที่</CText>
            <CText justify-self="end" mt="2" mb="2">{{
              eventDetail.eventDate
            }}</CText>

            <!-- Time -->
            <CText color="#828282" mt="2" mb="2">เวลา</CText>
            <CText justify-self="end" mt="2" mb="2">{{
              eventDetail.eventTime
            }}</CText>

            <!-- Location -->
            <CText color="#828282" mt="2" mb="2">สถานที่</CText>
            <CText justify-self="end" mt="2" mb="2">{{
              eventDetail.eventLocation
            }}</CText>

            <!-- invite -->
            <CText color="#828282" mt="2" mb="2">ผู้ร่วมนัด</CText>

            <!-- TODO: Align right -->
            <!-- Users -->
            <CBox justify-self="end" z-index="0" @click="openModal">
              <c-avatar-group max="5">
                <c-avatar
                  v-for="user in friendLists"
                  :key="user.userId"
                  :src="user.pictureUrl"
                  :name="user.displayName"
                  :alt="user.displayName"
                />
              </c-avatar-group>
            </CBox>
            <!-- Update -->
            <CText color="#828282" mt="2" mb="2">การอัปเดต</CText>
            <CText mt="2" justify-self="end" mb="2">{{
              eventDetail.needUpdate
            }}</CText>
            <!-- Notify -->
            <CText color="#828282" mt="2" mb="2">การแจ้งเตือน</CText>
            <CBox d="flex" justify-content="flex-end" flex-wrap="wrap">
              <CText text-align="right" mt="2" mb="0" ml="1" mr="1">
                {{ remindFreq.join(', ') }}
              </CText>
            </CBox>
          </CGrid>
        </CBox>
      </CBox>
    </CBox>

    <CModal :is-open="modalShow" :on-close="closeModal" is-centered>
      <CModalContent ref="content">
        <CModalHeader>ผู้ร่วมนัด</CModalHeader>
        <CModalCloseButton />
        <CModalBody>
          <CBox
            v-for="user in friendLists"
            :key="user.userId"
            pb="3"
            align-items="center"
            d="flex"
          >
            <CAvatar :name="user.displayName" :src="user.pictureUrl" mr="4" />
            {{ user.displayName }}
          </CBox>
        </CModalBody>
      </CModalContent>
      <c-modal-overlay />
    </CModal>
  </div>
</template>

<script lang="ts">
import liff from '@line/liff'
import Vue from 'vue'
import { authApi, groupApi } from '~/utils/api'

interface Ifriend {
  displayName: string
  pictureUrl: string
  status: string
  userId: string
}

export default Vue.extend({
  data() {
    return {
      modalShow: false,
      maxUsers: 5,
      eventDetail: {},
      friendLists: [{}] as Array<Ifriend>,
      remindFreq: [] as Array<string>,
    }
  },
  mounted() {
    liff
      .init({ liffId: '1655194495-Ewpqr4jO' })
      .then()
      .then(async () => {
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

    this.fetchData()
  },
  methods: {
    openModal() {
      this.modalShow = true
    },
    closeModal() {
      this.modalShow = false
    },
    async fetchData() {
      const getEventDetail = await this.$axios.get(
        groupApi('Cb34ad23b226c50f08c67308a3e75955a').getEventDetailWId()
      )
      console.log(getEventDetail.data.data)

      const rawEvent = getEventDetail.data.data

      rawEvent.eventDate = this.$dayjs
        .unix(rawEvent.eventDateTime._seconds)
        .format('DD MMM YYYY')

      rawEvent.eventTime = this.$dayjs
        .unix(rawEvent.eventDateTime._seconds)
        .format('HH:mm น.')

      this.eventDetail = rawEvent
      // @ts-expect-error
      this.friendLists = this.eventDetail.eventAttendee
      // @ts-expect-error
      this.eventDetail.needUpdate = this.eventDetail.needUpdate
        ? 'เปิดการใช้งาน'
        : 'ปิดการใช้งาน'
      for (const [key, value] of Object.entries(rawEvent.remindFreq)) {
        let msg = ''
        switch (key) {
          case 'b1d':
            msg = 'ก่อน 1 วัน'
            break
          case 'b60m':
            msg = 'ก่อน 60 นาที'
            break
          case 'ae15m':
            msg = 'หลังทุก ๆ 15 นาที'
            break
        }

        if (value === true) this.remindFreq.push(msg)
      }
      return getEventDetail.data.data
    },
  },
})
</script>
