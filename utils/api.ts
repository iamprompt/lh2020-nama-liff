const HOST = 'http://localhost:5001'
const FULL_URL = `${HOST}/nama-294515/asia-northeast1`

export const groupApi = (groupId: string) => {
  const getUrl = (func: string) => `${FULL_URL}/${func}?groupId=${groupId}`

  return {
    getGroupMembers: () => `${getUrl('getGroupMembers')}`,

    getEventDetail: (eventId: string) =>
      `${getUrl('event')}&eventId=${eventId}`,
  }
}

export const authApi = () => {
  return {
    verifyLINEToken: () => `${FULL_URL}/verifyLineToken`,
  }
}
