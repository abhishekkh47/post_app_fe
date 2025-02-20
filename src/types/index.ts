export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profile_pic?: string;
  bio?: string;
  isPrivate: boolean;
  posts: number;
  followers: number;
  following: number;
}

export interface Message {
  _id?: string;
  senderId: User;
  receiverId: User;
  content: string;
  isRead: boolean;
  attachments?: string[];
  createdAt?: string;
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

export interface Post {
  _id: string;
  userId: User;
  post: string;
  type: string;
  createdAt: string;
  comments?: Comment[];
  edited?: boolean;
}

export interface Comment {
  _id: string;
  userId: User;
  postId: string;
  content: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  bio?: string;
  profile_pic?: string;
  isPrivate?: boolean;
}
