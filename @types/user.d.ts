declare enum UserStatusType {
  unseen = 'unseen',
  acknowledged = 'acknowledged',
  traveling = 'traveling',
  arrived = 'arrived',
}

declare interface IFriend {
  name: string
  status: string
  imgURL: string
}

declare interface ILINEFriends {
  userId: string
  displayName: string
  pictureUrl: string
}
