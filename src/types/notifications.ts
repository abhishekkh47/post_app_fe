import { User } from ".";

export interface INotification {
  createdAt: string;
  isRead: boolean;
  message: string;
  receiverId: string;
  senderId: User;
}
