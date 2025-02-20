import Config from "../config";

class PostService {
  token = `Bearer ${localStorage.getItem("token")}`;

  async fetchPostsByUser(userId: string | undefined) {
    try {
      const endpoint = userId
        ? `get-posts-by-user/${userId.toString()}`
        : `get-my-posts`;
      const response = await fetch(`${Config.API_URL}/post/${endpoint}`, {
        headers: {
          Authorization: this.token,
        },
      });

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
      const response = await fetch(`${Config.API_URL}/post/get-feed`, {
        headers: {
          Authorization: this.token,
        },
      });

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
      const response = await fetch(`${Config.API_URL}/post/create-post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: this.token,
        },
        body: JSON.stringify({ post: content }),
      });

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
      const response = await fetch(
        `${Config.API_URL}/post/delete-post/${postId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: this.token,
          },
        }
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
      const response = await fetch(
        `${Config.API_URL}/post/edit-or-update-post`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: this.token,
          },
          body: JSON.stringify({ postId, post }),
        }
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
