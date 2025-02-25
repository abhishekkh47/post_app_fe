import Config from "../config";
import {
  POSTS,
  GET_SERVICE,
  POST_SERVICE,
  DELETE_SERVICE,
  PATH_SLUGS,
  PUT_SERVICE,
} from "../utils";

class PostService {
  async fetchPostsByUser(userId: string | undefined) {
    try {
      const endpoint = userId
        ? `get-posts-by-user/${userId.toString()}`
        : `get-my-posts`;
      const response = await GET_SERVICE(
        `${Config.API_URL}/post/v1/${endpoint}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      return (await response.json())?.data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async getFeed() {
    try {
      const response = await GET_SERVICE(POSTS.GET_FEED);
      if (!response.ok) {
        throw new Error("Failed to load feed");
      }
      return (await response.json())?.data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async createPost(content: string) {
    try {
      const response = await POST_SERVICE(
        POSTS.CREATE_POST,
        JSON.stringify({ post: content })
      );
      if (!response.ok) {
        throw new Error("Failed to create post");
      }
      return (await response.json())?.data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async deletePost(postId: string) {
    try {
      const response = await DELETE_SERVICE(
        POSTS.DELETE_POST.replace(PATH_SLUGS.POSTID, postId)
      );
      if (!response.ok) {
        throw new Error("Failed to delete post");
      }
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async updatePost(postId: string, post: string) {
    try {
      const response = await PUT_SERVICE(
        POSTS.UPDATE_POST,
        JSON.stringify({ postId, post })
      );
      if (!response.ok) {
        throw new Error("Failed to update post");
      }
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}
export default new PostService();
