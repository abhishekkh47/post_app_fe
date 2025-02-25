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
      const response = await POST_SERVICE(
        following ? FOLLOW.UNFOLLOW : FOLLOW.FOLLOW,
        JSON.stringify({
          followerId: data.followerId,
          followeeId: data.followeeId,
        })
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
