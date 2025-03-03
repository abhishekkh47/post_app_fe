import { GET_SERVICE, PUT_SERVICE, NOTIFICATION } from "../utils";

class NotificationService {
  async getNotifications() {
    try {
      const response = await GET_SERVICE(NOTIFICATION.GET_NOTIFICATIONS);
      if (!response.ok) {
        throw new Error("Failed to load notifications");
      }
      return (await response.json())?.data;
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
      if (!response.ok) {
        throw new Error("Failed to load notification");
      }
      return (await response.json())?.data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}

export default new NotificationService();
