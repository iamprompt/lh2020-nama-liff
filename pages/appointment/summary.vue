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
      pt="45px"
    >
      <CGrid template-columns="30% 70%">
        <CHeading font-size="xl" font-weight="bold" mb="5" align-self="end">
          รายละเอียดการนัดหมาย
        </CHeading>
        <CImage
          :src="require(`~/assets/images/shiba/shiba_create_header.svg`)"
          pos="relative"
          z-index="2"
          justify-self="end"
          right="10px"
          bottom="-10px"
        />
      </CGrid>

      <CBox
        d="flex"
        flex-dir="column"
        w="100%"
        bg="white"
        color="black"
        mb="3"
        rounded="12px"
        box-shadow="0px 5px 20px rgba(0, 0, 0, 0.08);"
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
            เจอกันวันแรก Orientation Day #LINEHACK2020
          </CText>
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
            align="right"
          >
            <!-- Date -->
            <CText color="#828282" mt="2" mb="2">วันที่</CText>
            <CText mt="2" mb="2">{{ _eventDate }}</CText>

            <!-- Time -->
            <CText color="#828282" mt="2" mb="2">เวลา</CText>
            <CText mt="2" mb="2">{{ _eventTime }}</CText>

            <!-- Location -->
            <CText color="#828282" mt="2" mb="2">สถานที่</CText>
            <CText mt="2" mb="2">{{ venue }}</CText>

            <!-- invite -->
            <CText color="#828282" mt="2" mb="2">ผู้ร่วมนัด</CText>

            <!-- TODO: Align right -->
            <!-- Users -->
            <CAvatarGroup justify-self="end" :max="maxUsers">
              <CAvatar
                v-for="user in users"
                :key="user.id"
                :src="user.src"
                :name="user.name"
                :alt="user.alt"
              />
            </CAvatarGroup>

            <!-- Update -->
            <CText color="#828282" mt="2" mb="2">การอัพเดต</CText>
            <CText mt="2" mb="2">{{ _isUpdate }}</CText>
            <!-- Notify -->
            <CText color="#828282" mt="2" mb="2">การแจ้งเตือน</CText>
            <div :class="remindFreqWrapper">
              <CText
                v-for="(req, index) in remindFreq"
                :key="req"
                mt="2"
                mb="0"
                ml="1"
                mr="1"
              >
                {{ translateRemindFreq(req, index) }}
              </CText>
            </div>
          </CGrid>
        </CBox>
      </CBox>
    </CBox>
  </div>
</template>

<script lang="ts">
import { css } from 'emotion'
import dayjs from 'dayjs'
import {
  eventDate,
  eventTime,
  venue,
  users,
  isUpdate,
  remindFreq,
} from '~/mockData/summary.json'

const maxUsers = 5

export default {
  data() {
    return {
      maxUsers,

      eventDate,
      eventTime,
      venue,
      users,
      isUpdate,
      remindFreq,
    }
  },
  computed: {
    remindFreqWrapper: () => css`
      display: flex;
      justify-content: flex-end;
      flex-wrap: wrap;
    `,
    _isUpdate: () => (isUpdate ? 'เปิดการใช้งาน' : 'ปิดการใช้งาน'),
    _eventDate: () => dayjs(eventDate).format('DD MMM YYYY'),
    _eventTime: () => dayjs(eventDate + ' ' + eventTime).format('HH:mm A'),
  },
  methods: {
    translateRemindFreq(val: string, index: number) {
      let msg = ''
      switch (val) {
        case 'b1d':
          msg = 'ก่อน 1 วัน'
          break
        case 'b60m':
          msg = 'ก่อน 60 นาที'
          break
        case 'e15m':
          msg = 'หลังทุก ๆ 15 นาที'
          break
      }

      if (index < remindFreq.length - 1) {
        msg += ','
      }

      return msg
    },
  },
}
</script>
