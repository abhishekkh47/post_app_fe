import { CHAT, GET_SERVICE, PATH_SLUGS, POST_SERVICE } from "../utils";

class ChatService {
  async getConversations() {
    try {
      const response = await GET_SERVICE(CHAT.GET_CONVERSATION);
      if (response.status < 200 || response.status >= 300) {
        throw new Error("Failed to get conversations");
      }
      return response.data.data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async getMessages(userId: string) {
    try {
      const response = await GET_SERVICE(
        CHAT.GET_MESSAGE.replace(PATH_SLUGS.USERID, userId)
      );
      if (response.status < 200 || response.status >= 300) {
        throw new Error("Failed to load chat");
      }
      return response.data.data;
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
      if (response.status < 200 || response.status >= 300) {
        throw new Error("Failed to create group");
      }
      return response.data.data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}
export default new ChatService();
