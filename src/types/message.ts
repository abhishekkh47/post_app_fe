import { User } from ".";

export interface Message {
  _id: string;
  senderId: User;
  receiverId: User;
  content: string;
  isRead: boolean;
  attachments?: string[];
  createdAt: string;
}

export interface Conversation {
  _id: string;
  userDetails: User;
  lastMessage: Omit<Message, "senderId" | "receiverId"> & {
    senderId: string;
    receiverId: string;
  };
  unreadCount?: number;
}
