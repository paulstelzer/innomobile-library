export interface MessageModel {
  id: string;
  icon: string;
  iconType: string;
  title: string;
  description: string;
  link: string;
  linkType: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationsStateModel {
  messages: MessageModel[];
}

export interface NotificationsConfig {
  path: {
    user: string;
    notifications: string;
  };
}
