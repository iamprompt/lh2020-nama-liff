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
        <CText font-size="sm">{{ eventTitleChar }}/50</CText>
      </CFlex>
      <!-- Grid to separate between Textarea and Image -->
      <CGrid template-columns="auto 120px">
        <!-- Event title Input textarea -->
        <CInput
          v-model="eventForm.eventTitle"
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
              <CBox d="block" mb="1">
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
              </CBox>
            </CFlex>
            <CFlex justify-content="center" align-items="center" h="2.5rem">
              <CSwitch color="orange" />
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
                    eventForm.notification[noti.slug]
                      ? 'rgba(240, 97, 41, 0.3);'
                      : '#F2F2F2;'
                  "
                  :border="
                    eventForm.notification[noti.slug]
                      ? '1px solid #F06129;'
                      : '1px solid #BDBDBD;'
                  "
                  :color="
                    eventForm.notification[noti.slug] ? '#F06129;' : '#BDBDBD;'
                  "
                  cursor="pointer"
                  @click="
                    eventForm.notification[noti.slug] = !eventForm.notification[
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

      <nuxt-link to="/schedule/select-participant">
        <c-button
          right-icon="arrow-forward"
          variant-color="orange"
          variant="solid"
          w="100%"
        >
          (1/3) ต่อไป
        </c-button>
      </nuxt-link>
    </CBox>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      eventForm: {
        eventTitle: '',
        eventDate: '2020-11-12',
        eventTime: '16:10',
        subscribeFriendUpdate: false,
        notification: {
          before1Day: true,
          before1Hour: false,
          afterEvery15Mins: false,
        },
      },
      notificationLabel: [
        {
          title: 'ก่อน 1 วัน',
          slug: 'before1Day',
        },
        {
          title: 'ก่อน 60 นาที',
          slug: 'before1Hour',
        },
        {
          title: 'หลังทุก ๆ 15 นาที',
          slug: 'afterEvery15Mins',
        },
      ],
    }
  },
  computed: {
    eventTitleChar(): number {
      return this.eventForm.eventTitle.length
    },
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

<style lang="scss">
input[type='date']::-webkit-calendar-picker-indicator {
  color: rgba(0, 0, 0, 0);
  opacity: 1;
  background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20.9062 1.875H18.75V0.75C18.75 0.335812 18.4142 0 18 0C17.5858 0 17.25 0.335812 17.25 0.75V1.875H6.75V0.75C6.75 0.335812 6.41423 0 6 0C5.58577 0 5.25 0.335812 5.25 0.75V1.875H3.09375C1.38783 1.875 0 3.26283 0 4.96875V20.9062C0 22.6122 1.38783 24 3.09375 24H20.9062C22.6122 24 24 22.6122 24 20.9062V4.96875C24 3.26283 22.6122 1.875 20.9062 1.875ZM22.5 20.9062C22.5 21.7865 21.7865 22.5 20.9062 22.5H3.09375C2.21353 22.5 1.5 21.7865 1.5 20.9062V8.48438C1.5 8.35495 1.60495 8.25 1.73438 8.25H22.2656C22.395 8.25 22.5 8.35495 22.5 8.48438V20.9062Z' fill='url(%23paint0_linear)'/%3E%3Cdefs%3E%3ClinearGradient id='paint0_linear' x1='12' y1='0' x2='12' y2='24' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0.166667' stop-color='%23FF9A3D'/%3E%3Cstop offset='1' stop-color='%23F06129'/%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E%0A");
  width: 18px;
  height: 18px;
  cursor: pointer;
  border-radius: 50%;
  margin-left: 0.5rem;
}

input[type='time']::-webkit-calendar-picker-indicator {
  color: rgba(0, 0, 0, 0);
  opacity: 1;
  background-image: url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M12 0C5.38293 0 0 5.38293 0 12C0 18.6171 5.38293 24 12 24C18.6171 24 24 18.6171 24 12C24 5.38293 18.6171 0 12 0ZM17.707 18.2069C17.512 18.4019 17.256 18.5001 17.0001 18.5001C16.7441 18.5001 16.4879 18.4019 16.2931 18.2069L11.293 13.207C11.105 13.0201 11.0001 12.7659 11.0001 12.5001V6C11.0001 5.44702 11.4479 5.00006 12 5.00006C12.5521 5.00006 12.9999 5.44702 12.9999 6V12.0861L17.707 16.793C18.098 17.1841 18.098 17.816 17.707 18.2069Z' fill='url(%23paint0_linear)'/%3E%3Cdefs%3E%3ClinearGradient id='paint0_linear' x1='12' y1='0' x2='12' y2='24' gradientUnits='userSpaceOnUse'%3E%3Cstop stop-color='%23F06129'/%3E%3Cstop offset='1' stop-color='%23FF9A3D'/%3E%3C/linearGradient%3E%3C/defs%3E%3C/svg%3E%0A");
  width: 18px;
  height: 18px;
  cursor: pointer;
  border-radius: 50%;
  margin-left: 0.5rem;
}
</style>
