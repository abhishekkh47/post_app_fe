export interface GroupDetails {
  _id: string;
  name: string;
  description: string;
  profile_pic?: string;
}

export interface ImagePreviewData {
  id: string;
  imagePreviews: string[];
  fileMetadata: fileMetadata[];
  isBase64: boolean;
}

export interface fileMetadata {
  name: string;
  type: string;
  size: number;
  lastModified: number;
}

export interface OnlineUsers {
  _id: string;
  firstName: string;
  lastName: string;
  profile_pic: string;
  email: string;
}

export type Tab = "followers" | "following";
