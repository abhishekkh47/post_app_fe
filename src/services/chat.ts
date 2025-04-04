import { CHAT, GET_SERVICE, PATH_SLUGS, POST_SERVICE } from "../utils";

class ChatService {
  async getConversations() {
    try {
      const response = await GET_SERVICE(CHAT.GET_CONVERSATION);
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
      const response = await GET_SERVICE(
        CHAT.GET_MESSAGE.replace(PATH_SLUGS.USERID, userId)
      );
      if (!response.ok) {
        throw new Error("Failed to load chat");
      }
      return (await response.json())?.data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async createChatGroup(formData: any) {
    try {
      const response = await POST_SERVICE(
        CHAT.CREATE_GROUP,
        JSON.stringify({
          name: formData.name,
          members: formData.members,
          description: formData.description,
        })
      );
      if (!response.ok) {
        throw new Error("Failed to create group");
      }
      return (await response.json())?.data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}
export default new ChatService();
