import Config from "../config";
import { AuthService } from ".";

class FollowService {
  async getFollowersOrFollowing(userId: string, type: string) {
    try {
      const response = await fetch(
        `${Config.API_URL}/follow/${type}/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: AuthService.getToken(),
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to ${type} user`);
      }
      return (await response.json())?.data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async followOrUnfollowUser(
    following: boolean,
    data: { followerId: string; followeeId: string }
  ) {
    try {
      const response = await fetch(
        `${Config.API_URL}/follow/${
          following ? "unfollow-user" : "follow-user"
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: AuthService.getToken(),
          },
          body: JSON.stringify({
            followerId: data.followerId,
            followeeId: data.followeeId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to follow/unfollow user");
      }
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}

export default new FollowService();
