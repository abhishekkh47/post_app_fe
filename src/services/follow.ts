import {
  GET_SERVICE,
  POST_SERVICE,
  FOLLOW,
  FRIENDS,
  PATH_SLUGS,
} from "../utils";

class FollowService {
  async getFollowersOrFollowing(userId: string, type: string) {
    try {
      const response = await GET_SERVICE(
        (type == FRIENDS.FOLLOWERS
          ? FOLLOW.FOLLOWERS
          : FOLLOW.FOLLOWING
        ).replace(PATH_SLUGS.USERID, userId)
      );

      if (response.status < 200 || response.status >= 300) {
        throw new Error(`Failed to ${type} user`);
      }
      return response.data.data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async followOrUnfollowUser(
    following: boolean,
    data: { followerId: string; followeeId: string }
  ) {
    try {
      const response = await POST_SERVICE(
        following ? FOLLOW.UNFOLLOW : FOLLOW.FOLLOW,
        JSON.stringify({
          followerId: data.followerId,
          followeeId: data.followeeId,
        })
      );

      if (response.status < 200 || response.status >= 300) {
        throw new Error("Failed to follow/unfollow user");
      }
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async getFriends() {
    try {
      const response = await GET_SERVICE(FOLLOW.FRIENDS);
      if (response.status < 200 || response.status >= 300) {
        throw new Error("Failed to load friends");
      }
      return response.data.data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}

export default new FollowService();
