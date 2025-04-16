import { COMMON, GET_STATUS_SERVICE, PATH_SLUGS, POST_SERVICE } from "../utils";

class CommonService {
  async uploadFiles(chatId: string, files: File[]) {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("chatMedia", file);
      });
      const response = await POST_SERVICE(
        COMMON.UPLOAD_FILE.replace(PATH_SLUGS.CHAT_ID, chatId),
        formData
      );
      if (response.status < 200 || response.status >= 300) {
        throw new Error("Failed to send");
      }
      return response.data.data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async getAppStatus() {
    try {
      return await GET_STATUS_SERVICE(COMMON.APP_STATUS);
    } catch (error) {
      return error;
      // throw new Error((error as Error).message);
    }
  }

  async subscribeNotifications(subscription: PushSubscription) {
    try {
      const response = await POST_SERVICE(
        COMMON.SUBSCRIBE_NOTIFICATIONS,
        JSON.stringify({ subscription: subscription })
      );
      if (response.status < 200 || response.status >= 300) {
        throw new Error("No comments found");
      }
      return response.data;
    } catch (error) {
      return error;
      // throw new Error((error as Error).message);
    }
  }
}
export default new CommonService();
