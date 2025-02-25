import { GET_SERVICE, PATH_SLUGS, USER } from "../utils";

class UserService {
  async fetchUserProfile(userId: string) {
    try {
      const response = await GET_SERVICE(
        USER.GET_PROFILE.replace(PATH_SLUGS.USERID, userId)
      );
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }
      return (await response.json())?.data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async searchUserProfile(search: string) {
    try {
      const response = await GET_SERVICE(
        USER.SEARCH_USER.replace(PATH_SLUGS.SEARCH, search)
      );
      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }
      return (await response.json())?.data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}
export default new UserService();
