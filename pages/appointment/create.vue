<template>
  <div class="container">
    <!-- Header Box -->
    <CBox
      w="100vw"
      h="150px"
      p="4"
      background="linear-gradient(17.62deg, #F06129 14.28%, #FF9A3D 86.61%);"
      color="white"
      mb="3"
      rounded-bottom="12px"
      box-shadow="0px 5px 20px rgba(0, 0, 0, 0.08);"
      pos="relative"
    >
      <!-- Header title -->
      <CFlex justify-content="space-between" mb="2">
        <CText font-size="sm">ตั้งชื่อนัดหมาย</CText>
        <!-- Count character -->
        <CText font-size="sm">{{ eventNameChar }}/50</CText>
      </CFlex>
      <!-- Grid to separate between Textarea and Image -->
      <CGrid template-columns="auto 120px">
        <!-- Event title Input textarea -->
        <CInput
          v-model="eventForm.eventName"
          as="textarea"
          variant="unstyled"
          placeholder="นัดอะไรดีน้า..."
          size="lg"
          font-weight="bold"
          :_placeholder="{ color: 'white' }"
          line-height="1.5em"
          maxlength="50"
          rows="3"
          style="overflow: hidden; resize: none"
        />
        <!-- Shiba Image on the right of the screen -->
        <CImage
          :src="require(`~/assets/images/shiba/shiba_create_header.svg`)"
          pos="absolute"
          right="20px"
          z-index="2"
          bottom="0"
          mb="-9px"
        />
      </CGrid>
    </CBox>

    <!-- Form -->
    <CBox p="4" pb="90px" class="forms">
      <!-- [TODO : Template for Date & Time Picker] Row 1 | Date & time -->
      <CGrid template-columns="60% auto" gap="10px" mb="4">
        <!-- Date -->
        <CInputGroup>
          <CInputLeftElement>
            <CIcon name="icalendar" color="#FF9A3D" />
          </CInputLeftElement>
          <CInput
            v-model="eventForm.eventDate"
            type="date"
            placeholder="นัดวันไหนดี"
            px="0.5rem"
            variant="unstyled"
            :min="todayDate"
            @change="calculateMinTime()"
          />
        </CInputGroup>
        <!-- Time -->
        <CInputGroup>
          <CInputLeftElement>
            <CIcon name="iclock" color="#FF9A3D" />
          </CInputLeftElement>
          <CInput
            v-model="eventForm.eventTime"
            type="time"
            placeholder="เวลา"
            px="0.5rem"
            variant="unstyled"
            :min="minTime"
          />
        </CInputGroup>
      </CGrid>

      <!-- Row 2 | Location -->
      <CGrid template-columns="auto" gap="10px" mb="4">
        <!-- Location -->
        <CInputGroup>
          <CInputLeftElement>
            <CIcon name="ipin" color="#FF9A3D" />
          </CInputLeftElement>
          <CInput
            v-model="eventForm.eventLocation"
            type="text"
            placeholder="เจอกันที่ไหนดีนะ"
            variant="unstyled"
          />
        </CInputGroup>
      </CGrid>

      <!-- Row 3 | Member Update -->
      <CGrid template-columns="auto" gap="10px" mb="4">
        <CBox class="choiceBox" d="flex" bg="white">
          <CGrid template-columns="2.5rem auto 3.5rem" w="100%">
            <CFlex
              w="2.5rem"
              h="2.5rem"
              align-items="center"
              justify-content="center"
            >
              <CIcon name="iprogress" color="#FF9A3D" />
            </CFlex>
            <CFlex flex-direction="column">
              <CText h="2.5rem" align-items="center" line-height="2.5rem">
                การอัปเดตจากสมาชิก
              </CText>
            </CFlex>
            <CFlex justify-content="center" align-items="center">
              <CSwitch v-model="eventForm.needUpdate" color="orange" />
            </CFlex>
          </CGrid>
        </CBox>
      </CGrid>

      <!-- Row 4 | Notification Define -->
      <CGrid template-columns="auto" gap="10px" mb="4">
        <CBox class="choiceBox" d="flex" bg="white">
          <CGrid template-columns="2.5rem auto" w="100%">
            <CFlex
              w="2.5rem"
              h="2.5rem"
              align-items="center"
              justify-content="center"
            >
              <CIcon name="ibell" color="#FF9A3D" />
            </CFlex>
            <CFlex flex-direction="column">
              <CText h="2.5rem" align-items="center" line-height="2.5rem">
                การแจ้งเตือน
              </CText>
              <CFlex mb="1" p="2" wrap="nowrap" overflow-x="auto">
                <CBox
                  v-for="noti in notificationLabel"
                  :key="noti.slug"
                  p="1"
                  px="2"
                  mr="5px"
                  font-size="sm"
                  rounded="12px"
                  :font-weight="
                    eventForm.remindFreq[noti.slug] ? 'bold' : 'normal'
                  "
                  :bg="
                    eventForm.remindFreq[noti.slug]
                      ? 'rgba(240, 97, 41, 0.3);'
                      : '#F2F2F2;'
                  "
                  :border="
                    eventForm.remindFreq[noti.slug]
                      ? '1px solid #F06129;'
                      : '1px solid #BDBDBD;'
                  "
                  :color="
                    eventForm.remindFreq[noti.slug] ? '#F06129;' : '#BDBDBD;'
                  "
                  cursor="pointer"
                  @click="
                    eventForm.remindFreq[noti.slug] = !eventForm.remindFreq[
                      noti.slug
                    ]
                  "
                >
                  {{ noti.title }}
                </CBox>
              </CFlex>
            </CFlex>
          </CGrid>
        </CBox>
      </CGrid>
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
      <CGrid template-columns="auto" column-gap="15px">
        <CBox>
          <CButton
            right-icon="arrow-forward"
            variant-color="orange"
            variant="solid"
            size="lg"
            rounded="12px"
            w="100%"
            @click="nextHandler"
          >
            (1/3) ต่อไป
          </CButton>
        </CBox>
      </CGrid>
    </CBox>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import liff from '@line/liff'
import { authApi, groupApi } from '~/utils/api'

export default Vue.extend({
  fetch() {
    liff.ready.then(async () => {
      if (liff.isLoggedIn()) {
        console.log(liff.getContext())
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
  },
  data() {
    return {
      todayDate: this.$dayjs().format('YYYY-MM-DD'),
      minTime: this.$dayjs().format('HH:mm'),
      eventForm: {
        eventName: this.$store.getters.getEvent.eventName,
        eventDate: this.$store.getters.getEvent.eventDate,
        eventTime: this.$store.getters.getEvent.eventTime,
        eventLocation: this.$store.getters.getEvent.eventLocation,
        needUpdate: this.$store.getters.getEvent.needUpdate,
        remindFreq: {
          b1d: this.$store.getters.getEvent.remindFreq.b1d,
          b60m: this.$store.getters.getEvent.remindFreq.b60m,
          ae15m: this.$store.getters.getEvent.remindFreq.ae15m,
        },
      },
      notificationLabel: [
        {
          title: 'ก่อน 1 วัน',
          slug: 'b1d',
        },
        {
          title: 'ก่อน 60 นาที',
          slug: 'b60m',
        },
        {
          title: 'หลังทุก ๆ 15 นาที',
          slug: 'ae15m',
        },
      ],
    }
  },
  computed: {
    eventNameChar(): number {
      return this.eventForm.eventName.length
    },
  },
  watch: {
    'eventForm.eventDate'(newVal: string) {
      if (this.todayDate !== newVal) {
        this.minTime = '00:00'
      } else {
        this.minTime = this.$dayjs().format('HH:mm')
      }
    },
  },
  async beforeCreate() {
    await liff.init({ liffId: '1655194495-kxjgmBQ6' })
  },
  mounted() {
    liff.ready.then(async () => {
      const LINEContext = await liff.getContext()
      console.log(LINEContext)

      this.$store.dispatch('setLINEContext', LINEContext)
      console.log(this.$store.getters.getLINEContext.groupId)

      const getGroupMembers = await this.$axios.get(
        groupApi(this.$store.getters.getLINEContext.groupId).getGroupMembers()
      )

      console.log(getGroupMembers)

      // console.log(getGroupMembers.data.data.profile)
      this.$store.dispatch('setGMembers', getGroupMembers.data.data.profile)
    })
  },
  methods: {
    nextHandler() {
      this.$store.dispatch('setEventInfo', this.eventForm)
      this.$router.push('/appointment/selectFriends')
    },
  },
  head: {
    title: 'สร้างนัดหมาย',
  },
})
</script>

<style lang="scss" scoped>
.forms input {
  box-shadow: 0px 3px 20px rgba(0, 0, 0, 0.1);
  border-radius: 8px;

  &:focus {
    box-shadow: 0px 3px 20px rgba(0, 0, 0, 0.2);
  }
}

.choiceBox {
  box-shadow: 0px 3px 20px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}
</style>
