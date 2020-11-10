<template>
  <CBox>
    <CBox
      pos="sticky"
      top="0"
      px="4"
      background="linear-gradient(180deg, #FFFFFF 80%, rgba(255, 255, 255, 0) 100%)"
      z-index="5"
    >
      <CHeading as="h1" size="xl" py="4">ชวนใครไปบ้าง?</CHeading>
    </CBox>

    <!--CBox px="4" pt="2" pb="80px">
      <UserList v-model="selectedFriends" :users="groupMembers" />
    </CBox-->

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

      <CBox py="0" overflow-x="auto" height="auto">
        <CBox key="all" pb="3" align-items="center" d="flex">
          <CBox mr="4" cursor="pointer" @click="toggleChecked('all')">
            <CImage
              :src="
                isChecked('all')
                  ? require('~/assets/images/icons/Checked.svg')
                  : require('~/assets/images/icons/Unchecked.svg')
              "
            />
          </CBox>

          <CAvatar name="ALL" mr="4" />
          เลือกทั้งหมด
        </CBox>
        <CBox
          v-for="user in usersList"
          :key="user.userId"
          pb="3"
          align-items="center"
          d="flex"
        >
          <CBox mr="4" cursor="pointer" @click="toggleChecked(user.userId)">
            <CImage
              :src="
                isChecked(user.userId)
                  ? require('~/assets/images/icons/Checked.svg')
                  : require('~/assets/images/icons/Unchecked.svg')
              "
            />
          </CBox>

          <CAvatar :name="user.displayName" :src="user.pictureUrl" mr="4" />
          {{ user.displayName }}
        </CBox>
      </CBox>
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
            @click="nextHandler"
          >
            (2/3) ต่อไป
          </CButton>
        </CBox>
      </CGrid>
    </CBox>
  </CBox>
</template>

<script lang="ts">
import Vue from 'vue'
import { groupApi } from '~/utils/api'

export default Vue.extend({
  data() {
    return {
      groupMembers: this.$store.getters.getGMembers as Array<ILINEFriends>,
      usersList: this.$store.getters.getGMembers as Array<ILINEFriends>,
      selectedAttendee: this.$store.getters.getAttendee,
      textSearch: '',
    }
  },
  watch: {
    groupMembers: {
      handler() {
        this.listUsers()
      },
    },
    textSearch: {
      handler(newValue, oldValue) {
        // @ts-ignore
        this.filterSearch(oldValue, newValue)
      },
      immediate: true,
    },
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    listUsers() {
      this.usersList = this.groupMembers
    },
    filterSearch(oldText: string, textSearch: string): void {
      // console.log(oldText, textSearch)

      if (textSearch.length === 0 && oldText === undefined) return
      if (textSearch.length === 0 && oldText.length > 0) this.listUsers()
      this.usersList = []

      this.groupMembers.forEach((friend) => {
        if (
          friend.displayName.toLowerCase().search(textSearch.toLowerCase()) !==
          -1
        ) {
          this.usersList.push(friend)
        }
      })
    },
    isChecked(userId: string): boolean {
      // console.log(userId)
      if (userId !== 'all') {
        return this.selectedAttendee.includes(userId)
      } else if (userId === 'all') {
        const userL = this.usersList.map((u) => u.userId)
        for (const id of userL) {
          if (!this.selectedAttendee.includes(id)) {
            return false
          }
        }
        return true
      }
      return false
    },
    toggleChecked(userId: string) {
      if (userId === 'all') {
        if (!this.isChecked('all')) {
          const allUsers = this.usersList.map((user) => user.userId)
          this.selectedAttendee = allUsers
        } else {
          this.selectedAttendee = []
        }
      } else if (this.isChecked(userId)) {
        const indexOfUser = this.selectedAttendee.indexOf(userId)
        this.selectedAttendee.splice(indexOfUser, 1)
      } else {
        this.selectedAttendee.push(userId)
      }
    },
    async fetchData() {
      // Cb34ad23b226c50f08c67308a3e75955a
      if (this.$store.getters.getGMembers.length === 0) {
        const getGroupMembers = await this.$axios.get(
          groupApi('Cb34ad23b226c50f08c67308a3e75955a').getGroupMembers()
        )
        // console.log(getGroupMembers.data.data.profile)
        this.groupMembers = getGroupMembers.data.data.profile
        this.$store.dispatch('setGMembers', this.groupMembers)
      }
    },
    backHandler() {
      this.$store.dispatch('setAttendee', this.selectedAttendee)
      this.$router.push('/appointment/create')
    },
    nextHandler() {
      this.$store.dispatch('setAttendee', this.selectedAttendee)
      this.$router.push('/appointment/review')
    },
  },
  head: {
    title: 'ชวนใครไปบ้าง?',
  },
})
</script>
