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

export interface Group {
  _id: string;
  name: string;
  description: string;
  createdBy: string;
  members: [
    {
      userId: string;
      role: string;
      _id: string;
      email: string;
      firstName: string;
      lastName: string;
      profile_pic: string;
    }
  ];
}

export interface GroupMessage {
  _id: string;
  senderId: Partial<User>;
  groupId: {
    name: string;
    _id: string;
  };
  content: string;
  readBy: {
    readAt: string;
    userId: string;
  };
  attachments?: string[];
  createdAt: string;
}
