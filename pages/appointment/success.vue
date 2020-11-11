<template>
  <div class="container">
    <CBox w="100vw" min-h="100vh" bg="#F2F2F2" pt="10" px="4" pb="4">
      <CBox mb="10vh" text-align="center">
        <CText font-size="2xl" font-weight="bold" mb="2">สำเร็จแล้ว!</CText>
        <CText font-size="lg">นามะชวนเพื่อนให้แล้วนะครับ</CText>
      </CBox>
      <CFlex justify="center">
        <CImage :src="require(`~/assets/images/shiba/shiba_success.svg`)" />
      </CFlex>
    </CBox>
    <CBox pos="fixed" w="100vw" bottom="4" px="4">
      <CButtonGroup d="flex" flex-dir="column">
        <CButton
          left-icon="iGoogleCalendar"
          right-icon="iplus"
          bg="#ffffff"
          w="100%"
          variant="solid"
          mb="3"
          @click="addtoCalendarHandler"
        >
          เพิ่มลงปฏิทินของคุณ
        </CButton>
        <CButton variant-color="orange" w="100%" variant="solid"> ปิด </CButton>
      </CButtonGroup>
    </CBox>
  </div>
</template>

<script lang="ts">
import liff from '@line/liff'
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {}
  },
  methods: {
    addtoCalendarHandler() {
      liff.openWindow({
        url: 'http://localhost:3000/appointment/addtoCalendar?groupId=11111',
        external: true,
      })
    },
    closeHandler() {
      liff.closeWindow()
    },
  },
})
</script>
