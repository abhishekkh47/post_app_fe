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
