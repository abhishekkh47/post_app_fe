export interface GroupDetails {
  name: string;
  description: string;
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
