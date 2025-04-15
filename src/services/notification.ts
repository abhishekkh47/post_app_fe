import { GET_SERVICE, PUT_SERVICE, NOTIFICATION } from "../utils";

class NotificationService {
  async getNotifications() {
    try {
      const response = await GET_SERVICE(NOTIFICATION.GET_NOTIFICATIONS);
      if (response.status < 200 || response.status >= 300) {
        throw new Error("Failed to load notifications");
      }
      return response.data.data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async readNotifications(notificationId: string) {
    try {
      const response = await PUT_SERVICE(
        NOTIFICATION.READ_NOTIFICATION,
        JSON.stringify({ notificationId })
      );
      if (response.status < 200 || response.status >= 300) {
        throw new Error("Failed to load notification");
      }
      return response.data.data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async readAllNotifications() {
    try {
      const response = await PUT_SERVICE(NOTIFICATION.MARK_ALL_READ, "");
      if (response.status < 200 || response.status >= 300) {
        throw new Error("Failed to load notification");
      }
      return response.data.data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}

export default new NotificationService();
