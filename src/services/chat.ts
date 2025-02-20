import Config from "../config";

class ChatService {
  token = `Bearer ${localStorage.getItem("token")}`;

  async getConversations() {
    try {
      const response = await fetch(`${Config.API_URL}/chat/conversations`, {
        headers: {
          Authorization: this.token,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to get conversations");
      }
      return (await response.json())?.data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async getMessages(userId: string) {
    try {
      const response = await fetch(
        `${Config.API_URL}/chat/messages/${userId}`,
        {
          headers: {
            Authorization: this.token,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to load chat");
      }
      return (await response.json())?.data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}
export default new ChatService();
