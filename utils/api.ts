// const HOST = 'http://localhost:5001'
// const FULL_URL = `${HOST}/nama-294515/asia-northeast1`
const HOST = 'https://asia-northeast1-nama-294515.cloudfunctions.net'
const FULL_URL = `${HOST}`
export const groupApi = (groupId: string) => {
  const getUrl = (func: string) => `${FULL_URL}/${func}?groupId=${groupId}`

  return {
    getGroupMembers: () => `${getUrl('getGroupMembers')}`,

    getEventDetail: () => `${getUrl('event')}`,
    createEvent: () => `${getUrl('event')}`,

    updateStatus: (status: UserStatusType, userId: string) =>
      `${getUrl('status')}&status=${status}&userId=${userId}`,
  }
}

export const authApi = () => {
  return {
    createCustomToken: () => `${FULL_URL}/createCustomToken`,
  }
}
