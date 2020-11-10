import dayjs from 'dayjs'

export const state = () => ({
  eventInfo: {
    eventName: '',
    eventDate: dayjs().format('YYYY-MM-DD'),
    eventTime: dayjs().format('HH:mm'),
    eventLocation: '',
    needUpdate: false,
    remindFreq: {
      b1d: false,
      b60m: false,
      ae15m: false,
    },
  },
  participatedAttendee: [],
})

export const getters = {
  getEvent(state) {
    return state.eventInfo
  },
  getAttendee(state) {
    return state.participatedAttendee
  },
}

export const mutations = {
  SET_EVENTINFO(state, data) {
    state.eventInfo = {
      ...state.eventInfo,
      ...data,
    }
  },
  SET_ATTENDEE(state, data) {
    state.participatedAttendee = data
  },
}

export const actions = {
  setEventInfo({ commit }, data) {
    commit('SET_EVENTINFO', data)
  },
  setAttendee({ commit }, data) {
    commit('SET_ATTENDEE', data)
  },
}
