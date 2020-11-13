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
        <CHeading color="#4F4F4F">ผมกำลังอัพเดตสถานะให้คุณสักครู่...</CHeading>
        <c-image
          mt="3rem"
          mx="auto"
          :src="require('~/assets/images/nama_loader.png')"
        />
      </div>
    </CBox>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import liff from '@line/liff/dist/lib'

import { groupApi } from '~/utils/api'

export default Vue.extend({
  data: () => ({
    isLoaded: false,
  }),
  watch: {
    async isLoaded(newVal: string) {
      if (newVal) {
        await liff.closeWindow()
      }
    },
  },
  async beforeCreate() {
    // Initialize LIFF
    await liff.init({ liffId: '1655194495-D0POdALl' })
  },
  mounted() {
    liff.ready.then(async () => {
      if (liff.isLoggedIn()) {
        const userId = await this.getUserId()
        const groupId = await this.getGroupId()
        const updateToStatus = this.$route.query.status as string

        await this.updateStatus(updateToStatus, groupId, userId)
        this.isLoaded = true
      } else {
        console.error('LIFF not login')
      }
    })
  },
  methods: {
    async getUserId() {
      const LINEprofile = await liff.getProfile()
      return LINEprofile.userId
    },

    async getGroupId() {
      const LINEContext = await liff.getContext()
      return LINEContext?.groupId || 'Ce78c9d91679c5c958514dee41e53ab19'
    },
    async updateStatus(status: string, groupId: string, userId: string) {
      const updateResult = await this.$axios.post(
        groupApi(groupId).updateStatus(status, userId)
      )

      console.log('updateResult')
      console.log(updateResult)
    },
  },
})
</script>
