import Config from "../config";

class UserService {
  token = `Bearer ${localStorage.getItem("token")}`;

  async fetchUserProfile(userId: string) {
    try {
      const response = await fetch(
        `${Config.API_URL}/user/get-profile/${userId}`,
        {
          headers: {
            Authorization: this.token,
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
