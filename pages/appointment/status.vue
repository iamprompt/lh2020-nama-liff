<template>
  <div class="container">
    <!-- <CBox
      w="100vw"
      p="4"
      background="linear-gradient(129.5deg, #FF9A3D 27.41%, #FADAB7 99.07%);"
      color="white"
      mb="3"
    >
      <CHeading font-size="lg">{{ eventDetail.title }}</CHeading>
      <CText justi>
        <span><CIcon name="calendar-alt" mr="2" /></span>{{ eventDetail.date }}
        <span><CIcon name="clock" mx="2" /></span>{{ eventDetail.time }}
      </CText>
    </CBox> -->

    <div class="header">
      <!-- header box -->
      <!-- TODO: change the degree of gradient -->
      <CGrid
        template-columns="85% 15%"
        p="4"
        background="linear-gradient(17.62deg, #F06129 14.28%, #FF9A3D 86.61%);"
        color="white"
        rounded-bottom="12px"
        pos="relative"
      >
        <!-- header message -->
        <CBox>
          <CHeading font-size="lg">
            {{ eventDetail.eventName }}
          </CHeading>

          <CText>
            <span><CIcon name="calendar-alt" mr="2" /></span
            >{{ eventDetail.eventDate }}
            <span><CIcon name="clock" mx="2" /></span
            >{{ eventDetail.eventTime }}
          </CText>
        </CBox>
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
    </div>

    <div>
      <CTabs variant="unstyled">
        <CBox overflow-x="scroll" white-space="nowrap" class="tab">
          <CTabList>
            <CTab
              v-for="status in statuses"
              :key="status.title"
              d="inline-block"
            >
              {{ status.title }}
            </CTab>
          </CTabList>
        </CBox>

        <CBox px="4" pt="2" pb="80px">
          <CBox pb="4">
            <CInputGroup>
              <CInputLeftElement
                ><CIcon name="search" color="gray.300"
              /></CInputLeftElement>
              <CInput
                v-model="textSearch"
                type="text"
                placeholder="ค้นหารายชื่อเพื่อนในกลุ่ม"
                @change="filterSearch()"
              />
            </CInputGroup>
          </CBox>

          <CTabPanels>
            <CTabPanel v-for="status in statuses" :key="status.title">
              <CBox
                v-for="user in statusFriend(status.slug)"
                :key="user.userId"
                pb="3"
                align-items="center"
                d="flex"
              >
                <CAvatar
                  :name="user.displayName"
                  :src="user.pictureUrl"
                  mr="4"
                />
                {{ user.displayName }}
              </CBox>
            </CTabPanel>
          </CTabPanels>
        </CBox>
      </CTabs>
    </div>
  </div>
</template>

<script lang="ts">
import liff from '@line/liff'
import Vue from 'vue'
import { authApi, groupApi } from '~/utils/api'
interface Istatus {
  [index: string]: {
    title: string
    friends: Array<Ifriend>
  }
}
interface Ifriend {
  displayName: string
  pictureUrl: string
  status: string
  userId: string
}
export default Vue.extend({
  fetch() {
    liff.ready.then(() => {
      if (liff.isLoggedIn()) {
        console.log(liff.getContext())
        console.log('Login')
      } else {
        console.log('Not Login')
        // liff.login()
      }
    })
  },
  data() {
    return {
      textSearch: '',
      eventDetail: {},
      statusType: ['notSeen', 'acknowledged', 'travelling', 'arrived'] as Array<
        string
      >,
      statuses: {
        unseen: {
          slug: 'unseen',
          title: 'ยังไม่เห็น',
          friends: [],
        },
        acknowledged: {
          slug: 'acknowledged',
          title: 'รับรู้แล้ว',
          friends: [],
        },
        traveling: {
          slug: 'traveling',
          title: 'กำลังเดินทาง',
          friends: [],
        },
        arrived: {
          slug: 'arrived',
          title: 'ถึงแล้ว',
          friends: [],
        },
      } as Istatus,
      friendLists: [] as Array<Ifriend>,
      friends: [] as Ifriend[],
    }
  },
  watch: {
    textSearch: {
      handler(newValue, oldValue) {
        // @ts-ignore
        this.filterSearch(oldValue, newValue)
      },
      immediate: true,
    },
  },
  async beforeCreate() {
    await liff.init({ liffId: '1655194495-dmpj59zq' })
  },
  async mounted() {
    const LINEContext = await liff.getContext()

    const getEventDetail = await this.$axios.get(
      groupApi(
        LINEContext?.groupId || 'Ce78c9d91679c5c958514dee41e53ab19'
      ).getEventDetailWId()
    )

    console.log(getEventDetail)

    const rawEvent = getEventDetail.data.data

    rawEvent.eventDate = this.$dayjs
      .unix(rawEvent.eventDateTime._seconds)
      .format('DD MMM YYYY')

    rawEvent.eventTime = this.$dayjs
      .unix(rawEvent.eventDateTime._seconds)
      .format('HH:mm น.')

    this.eventDetail = rawEvent
    this.updateFriendsList()

    // this.fetchData()
  },
  methods: {
    statusFriend(status: string) {
      return this.friends.filter((a) => {
        return a.status === status
      })
    },
    filterSearch(oldText: string, textSearch: string): void {
      // console.log(oldText, textSearch)
      if (textSearch.length === 0 && oldText === undefined) return
      if (textSearch.length === 0 && oldText.length > 0)
        this.updateFriendsList()
      this.friends = []
      this.friendLists.forEach((friend) => {
        if (
          friend.displayName.toLowerCase().search(textSearch.toLowerCase()) !==
          -1
        ) {
          this.friends.push(friend)
        }
      })
    },
    async fetchData() {
      const LINEContext = await liff.getContext()
      if (LINEContext !== null) {
        const getEventDetail = await this.$axios.get(
          groupApi(LINEContext.groupId).getEventDetailWId()
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
        this.updateFriendsList()

        return getEventDetail.data.data
      }
    },
    updateFriendsList() {
      // @ts-expect-error
      this.friendLists = this.eventDetail.attendeeList
      // @ts-expect-error
      this.friends = this.eventDetail.attendeeList
    },
  },
})
</script>

<style lang="scss">
[role='tab'] {
  color: #bdbdbd;
  font-weight: bold;
  &[aria-selected='true'] {
    color: #f06129;
    background: -webkit-linear-gradient(180deg, #ff9a3d 13.02%, #f06129 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.tab::-webkit-scrollbar {
  display: none;
}
</style>
