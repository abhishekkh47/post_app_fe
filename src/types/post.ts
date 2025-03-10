import { User } from ".";

export interface Post {
  _id: string;
  userId: User;
  post: string;
  type: string;
  createdAt: string;
  commentList?: Comment[];
  comments: number;
  edited?: boolean;
  reactions: number;
  liked: boolean;
}

export interface Comment {
  _id: string;
  userId: User;
  postId: string;
  content: string;
  createdAt: string;
}
