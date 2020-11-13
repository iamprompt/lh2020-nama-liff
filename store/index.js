import dayjs from 'dayjs'

export const state = () => ({
  eventInfo: {
    eventName: '',
    eventDate: dayjs().format('YYYY-MM-DD'),
    eventTime: dayjs().format('HH:mm'),
    eventLocation: '',
    needUpdate: true,
    remindFreq: {
      b1d: true,
      b60m: true,
      ae15m: true,
    },
  },
  participatedAttendee: [],
  groupMembers: [],
  LINEContext: {},
})

export const getters = {
  getEvent(state) {
    return state.eventInfo
  },
  getAttendee(state) {
    return state.participatedAttendee
  },
  getGMembers(state) {
    return state.groupMembers
  },
  getLINEContext(state) {
    return state.LINEContext
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
  SET_GMEMBERS(state, data) {
    state.groupMembers = data
  },
  SET_LINECONTEXT(state, data) {
    state.LINEContext = data
  },
}

export const actions = {
  setEventInfo({ commit }, data) {
    commit('SET_EVENTINFO', data)
  },
  setAttendee({ commit }, data) {
    commit('SET_ATTENDEE', data)
  },
  setGMembers({ commit }, data) {
    commit('SET_GMEMBERS', data)
  },
  setLINEContext({ commit }, data) {
    commit('SET_LINECONTEXT', data)
  },
}
