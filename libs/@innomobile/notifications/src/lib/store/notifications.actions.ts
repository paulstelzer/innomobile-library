import { MessageModel } from "./notifications.model";

// Actions
export class InitNotifications {
  static type = '[Notifications] Init';
}

export class SetNotifications {
  static type = '[Notifications] Set Notifications';
  constructor(public messages: MessageModel[]) {}
}

export class AddMessage {
  static type = '[Notifications] Add Message';
  constructor(public message: MessageModel) {}
}

export class UpdateMessage {
  static type = '[Notifications] Update Message';
  constructor(public id: string, public data: any) {}
}

export class RemoveAllNotifications {
  static type = '[Notifications] Remove All';
}

export class RemoveNotification {
  static type = '[Notifications] Remove';
  constructor(public id: string) {}
}