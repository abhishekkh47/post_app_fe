import Config from "../config";
import { AuthService } from ".";

class CommentService {
  async createComment(postId: string, content: string) {
    try {
      const response = await fetch(`${Config.API_URL}/comment/create-comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: AuthService.getToken(),
        },
        body: JSON.stringify({
          postId,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create comment");
      }
      return (await response.json())?.data;
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async deleteComment(commentId: string) {
    try {
      const response = await fetch(
        `${Config.API_URL}/comment/delete-comment/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: AuthService.getToken(),
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async getPostComments(postId: string) {
    try {
      const response = await fetch(
        `${Config.API_URL}/comment/get-post-comments/${postId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("No comments found");
      }
      return (await response.json())?.data;
    } catch (error) {}
  }
}

export default new CommentService();
