import {
  GROUP_CHAT,
  GET_SERVICE,
  PATH_SLUGS,
  POST_SERVICE,
  PUT_SERVICE,
  DELETE_SERVICE,
} from "../utils";

class GroupChatService {
  async getGroups() {
    try {
      const response = await GET_SERVICE(GROUP_CHAT.GET_GROUPS);
      if (!response.ok) {
        throw new Error("Failed to get groups");
      }
      return (await response.json())?.data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async createGroup(name: string, description: string, members: string[] = []) {
    try {
      const response = await POST_SERVICE(
        GROUP_CHAT.CREATE_GROUP,
        JSON.stringify({
          name,
          description,
          members,
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

  async deleteGroup(groupId: string) {
    try {
      const response = await GET_SERVICE(
        GROUP_CHAT.DELETE_GROUP.replace(PATH_SLUGS.GROUP_ID, groupId)
      );
      if (!response.ok) {
        throw new Error("Failed to delete group");
      }
      return (await response.json())?.data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async getGroupById(groupId: string) {
    try {
      const response = await GET_SERVICE(
        GROUP_CHAT.GET_GROUP_BY_ID.replace(PATH_SLUGS.GROUP_ID, groupId)
      );
      if (!response.ok) {
        throw new Error("Failed to load chat");
      }
      return (await response.json())?.data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async updateGroup(groupId: string, name: string, description: string) {
    try {
      const response = await PUT_SERVICE(
        GROUP_CHAT.UPDATE_GROUP.replace(PATH_SLUGS.GROUP_ID, groupId),
        JSON.stringify({ name, description })
      );
      if (!response.ok) {
        throw new Error("Failed to load chat");
      }
      return (await response.json())?.data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async addGroupMembers(groupId: string, members: string) {
    try {
      const response = await POST_SERVICE(
        GROUP_CHAT.ADD_GROUP_MEMBERS.replace(PATH_SLUGS.GROUP_ID, groupId),
        JSON.stringify({ members })
      );
      if (!response.ok) {
        throw new Error("Failed to load chat");
      }
      return (await response.json())?.data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async removeGroupMember(groupId: string, userId: string) {
    try {
      const response = await DELETE_SERVICE(
        GROUP_CHAT.REMOVE_GROUP_MEMBER.replace(
          PATH_SLUGS.GROUP_ID,
          groupId
        ).replace(PATH_SLUGS.USERID, userId)
      );
      if (!response.ok) {
        throw new Error("Failed to load chat");
      }
      return (await response.json())?.data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async getGroupMessages(groupId: string) {
    try {
      const response = await GET_SERVICE(
        GROUP_CHAT.GET_GROUP_MESSAGE.replace(PATH_SLUGS.GROUP_ID, groupId)
      );
      if (!response.ok) {
        throw new Error("Failed to load chat");
      }
      return (await response.json())?.data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async getGroupDetails(groupId: string) {
    try {
      const response = await GET_SERVICE(
        GROUP_CHAT.GET_GROUP_DETAILS.replace(PATH_SLUGS.GROUP_ID, groupId)
      );
      if (!response.ok) {
        throw new Error("An error occurred");
      }
      return (await response.json())?.data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}
export default new GroupChatService();
