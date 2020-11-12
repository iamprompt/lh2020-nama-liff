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
      pt="10"
      pb="90px"
    >
      <CHeading font-size="xl" font-weight="bold" text-align="center" mb="12">
        ตัวอย่างข้อความก่อนส่ง
      </CHeading>

      <CFlex direction="row" mx="5">
        <!-- message box -->
        <CBox
          id="eventDetailBox"
          d="flex"
          flex-dir="column"
          w="100%"
          bg="white"
          color="black"
          mb="3"
          rounded="12px"
          pos="relative"
          box-shadow="0px 5px 20px rgba(0, 0, 0, 0.08);"
        >
          <!-- header box -->
          <CBox
            id="header"
            background="linear-gradient(17.62deg, #F06129 14.28%, #FF9A3D 86.61%);"
            color="white"
            rounded-top="12px"
          >
            <!-- TODO: change the degree of gradient -->
            <CGrid template-columns="auto 50px" p="3" gap="10px" pos="relative">
              <!-- header message -->
              <CText font-size="large" font-weight="bold">
                {{ eventDetail.eventName }}
              </CText>
              <CImage
                :src="require(`~/assets/images/shiba/shiba_icon.svg`)"
                align-self="center"
                border-radius="50%"
                z-index="2"
                top="0"
                width="100%"
                pos="relative"
              />
            </CGrid>
          </CBox>
          <CBox id="body">
            <!-- Event Detail -->
            <CBox id="detail" p="4" class="forms">
              <CFlex id="dateTime" justify="space-between">
                <CBox>
                  <CText color="#828282" mt="2">วันที่</CText>
                  <CText mb="2" font-weight="bold">{{ _eventDate }}</CText>
                </CBox>
                <CBox text-align="right">
                  <CText color="#828282" mt="2">เวลา</CText>
                  <CText mb="2" font-weight="bold">{{ _eventTime }} น.</CText>
                </CBox>
              </CFlex>

              <CDivider />

              <CFlex id="location">
                <CBox>
                  <CText color="#828282" mt="2">สถานที่</CText>
                  <CText mb="2" font-weight="bold">{{
                    eventDetail.eventLocation
                      ? eventDetail.eventLocation
                      : 'ไม่รู้โว้ยยย'
                  }}</CText>
                </CBox>
              </CFlex>

              <CDivider />

              <CFlex id="members">
                <CBox>
                  <CText color="#828282" mt="2">สมาชิก</CText>
                  <CText mb="2" font-weight="bold">{{ _members }}</CText>
                </CBox>
              </CFlex>
            </CBox>
          </CBox>
        </CBox>
      </CFlex>
    </CBox>
    <CBox
      pos="fixed"
      bottom="0"
      w="100%"
      px="4"
      py="4"
      bg="white"
      border-radius="xl"
      box-shadow="0px 3px 20px rgba(0, 0, 0, 0.1)"
    >
      <CGrid template-columns="20% auto" column-gap="15px">
        <CBox>
          <!-- left-icon="arrow-forward" -->
          <CButton
            variant-color="white"
            variant="outline"
            w="100%"
            size="lg"
            rounded="12px"
            @click="backHandler"
          >
            ย้อนกลับ
          </CButton>
        </CBox>
        <CBox>
          <CButton
            right-icon="arrow-forward"
            variant-color="orange"
            variant="solid"
            w="100%"
            size="lg"
            rounded="12px"
            @click="submitTheEvent"
          >
            (3/3) บันทึกและส่ง
          </CButton>
        </CBox>
      </CGrid>
    </CBox>

    <CModal
      :is-open="modal.show"
      :on-close="modalClose"
      :close-on-overlay-click="false"
      is-centered
    >
      <CModalContent ref="content">
        <CModalHeader>{{ modal.title }}</CModalHeader>
        <CModalBody>{{ modal.message }}</CModalBody>
        <CModalFooter>
          <CButton @click="liff.closeWindow()">ปิด</CButton>
        </CModalFooter>
      </CModalContent>
      <CModalOverlay />
    </CModal>
  </div>
</template>

<script lang="ts">
import liff from '@line/liff/dist/lib'
import Vue from 'vue'
import { groupApi } from '~/utils/api'

export default Vue.extend({
  data() {
    return {
      modal: {
        show: false,
        title: '',
        message: '',
      },
      eventDetail: this.$store.getters.getEvent,
      eventAttendee: this.$store.getters.getAttendee as Array<string>,
      groupMembers: this.$store.getters.getGMembers as Array<ILINEFriends>,
    }
  },
  computed: {
    _eventDateTime() {
      // @ts-expect-error
      return `${this.eventDetail.eventDate} ${this.eventDetail.eventTime}`
    },
    _eventDate() {
      // @ts-expect-error
      return this.$dayjs(this.eventDetail.eventDate).format('D MMM YYYY')
    },
    _eventTime() {
      // @ts-expect-error
      return this.$dayjs(this._eventDateTime).format('HH:mm')
    },
    _members() {
      return (
        // @ts-expect-error
        this.groupMembers
          // @ts-expect-error
          .filter((member) => {
            return this.eventAttendee.includes(member.userId)
          })
          // @ts-expect-error
          .map((m) => `@${m.displayName}`)
          .join(', ')
      )
    },
  },
  methods: {
    modalOpen() {
      this.modal.show = true
    },
    modalClose() {
      this.modal.show = false
    },
    backHandler() {
      // this.$store.dispatch('setAttendee', this.selectedAttendee)
      this.$router.push('/appointment/selectFriends')
    },
    nextHandler() {
      // this.$store.dispatch('setAttendee', this.selectedAttendee)
      this.submitTheEvent()
      liff.closeWindow()
      // this.$router.push('/appointment/review')
    },
    async submitTheEvent() {
      const eventDetail = this.$store.getters.getEvent
      const eventParticipant: string[] = this.$store.getters.getAttendee
      if (liff.isLoggedIn()) {
        const LINEprofile = await liff.getProfile()
        const payload = {
          eventName: eventDetail.eventName,
          eventDate: eventDetail.eventDate,
          eventTime: eventDetail.eventTime,
          eventStatus: 'active',
          eventDateTime: this.$fireModule.firestore.Timestamp.fromDate(
            this.$dayjs(
              `${eventDetail.eventDate}T${eventDetail.eventTime}:00+07:00`
            ).toDate()
          ),
          eventLocation: eventDetail.eventLocation,
          needUpdate: eventDetail.needUpdate,
          remindFreq: eventDetail.remindFreq,
          eventAttendee: eventParticipant.map((attendee) => {
            return {
              userId: attendee,
              status:
                attendee === LINEprofile.userId ? 'acknowledged' : 'unseen',
            }
          }),
          ownerId: LINEprofile.userId,
        }
        const LINEContext = await liff.getContext()

        if (LINEContext !== null) {
          try {
            const sendData = await this.$axios.$post(
              groupApi(LINEContext.groupId).createEvent(),
              payload,
              {
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            )
            console.log(sendData)
          } catch (error) {
            this.modal.title = 'เกิดข้อผิดพลาด'
            this.modal.message = 'สร้างนัดหมายได้ทีละนัดหมายน้าาาา'
            this.modal.show = true
          }
        }
      }

      this.$router.push('/appointment/success')
    },
  },
})
</script>
