import { User } from ".";

export interface INotification {
  _id: string;
  createdAt: string;
  isRead: boolean;
  message: string;
  receiverId: string;
  senderId: User;
}
