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
    <CBox p="4" class="forms">
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
              <!--CBox d="block" mb="1">
                <CFlex
                  justify-content="center"
                  align-items="center"
                  h="10px"
                  my="10px"
                >
                  <CBox d="relative" w="100%" h="2px" bg="#FF9A3D" z-index="0">
                    <CFlex justify-content="space-between">
                      <CBox
                        w="20px"
                        h="20px"
                        mt="-10px"
                        left="0%"
                        rounded="100%"
                        box-shadow="0px 0px 7px rgba(0, 0, 0, 0.15);"
                        justify-content="center"
                        align-items="center"
                        z-index="1"
                        bg="#FFFFFF"
                      >
                        <CBox
                          bg="#F06129"
                          w="10px"
                          h="10px"
                          z-index="2"
                          m="5px"
                          rounded="100%"
                        ></CBox>
                      </CBox>
                      <CBox
                        w="20px"
                        h="20px"
                        mt="-10px"
                        left="0%"
                        rounded="100%"
                        box-shadow="0px 0px 7px rgba(0, 0, 0, 0.15);"
                        justify-content="center"
                        align-items="center"
                        z-index="1"
                        bg="#FFFFFF"
                      >
                        <CBox
                          bg="#F06129"
                          w="10px"
                          h="10px"
                          z-index="2"
                          m="5px"
                          rounded="100%"
                        />
                      </CBox>
                      <CBox
                        w="20px"
                        h="20px"
                        mt="-10px"
                        left="0%"
                        rounded="100%"
                        box-shadow="0px 0px 7px rgba(0, 0, 0, 0.15);"
                        justify-content="center"
                        align-items="center"
                        z-index="1"
                        bg="#FFFFFF"
                      >
                        <CBox
                          bg="#F06129"
                          w="10px"
                          h="10px"
                          z-index="2"
                          m="5px"
                          rounded="100%"
                        />
                      </CBox>
                    </CFlex>
                  </CBox>
                </CFlex>
              </!--CBox-->
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
                  mr="5px"
                  font-size="sm"
                  rounded="12px"
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

      <c-button
        right-icon="arrow-forward"
        variant-color="orange"
        variant="solid"
        w="100%"
        @click="next"
      >
        (1/3) ต่อไป
      </c-button>
    </CBox>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import liff from '@line/liff'
import { authApi } from '~/utils/api'

export default Vue.extend({
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
  mounted() {
    liff.init({ liffId: '1655194495-kxjgmBQ6' }).then(async () => {
      if (liff.isLoggedIn()) {
        console.log('Login')
        const firebaseToken = await this.$axios.get(
          authApi().verifyLINEToken(),
          { token: liff.getAccessToken() }
        )
        this.$fire.auth
          .signInWithCustomToken(firebaseToken)
          .catch((error: any) => {
            // Handle Errors here.
            console.log(error)
          })
      } else {
        console.log('Not Login')
        // liff.login()
      }
    })
  },
  methods: {
    next() {
      this.$store.dispatch('setEventInfo', this.eventForm)
      this.$router.push('selectFriends')
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
