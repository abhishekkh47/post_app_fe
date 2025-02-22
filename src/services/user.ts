import Config from "../config";
import { AuthService } from ".";

class UserService {
  async fetchUserProfile(userId: string) {
    try {
      const response = await fetch(
        `${Config.API_URL}/user/get-profile/${userId}`,
        {
          headers: {
            Authorization: AuthService.getToken(),
          },
        }
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
      const response = await fetch(
        `${Config.API_URL}/user/search-user?search=${search}`,
        {
          headers: {
            Authorization: AuthService.getToken(),
          },
        }
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
