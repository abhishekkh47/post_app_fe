import { CHAT_MEDIA, PATH_SLUGS, POST_SERVICE } from "../utils";

class CommonService {
  async uploadFiles(chatId: string, files: File[]) {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("chatMedia", file);
      });
      const response = await POST_SERVICE(
        CHAT_MEDIA.UPLOAD_FILE.replace(PATH_SLUGS.CHAT_ID, chatId),
        formData
      );
      if (!response.ok) {
        throw new Error("Failed to send");
      }
      return (await response.json())?.data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}
export default new CommonService();
