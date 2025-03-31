import {
  POST_SERVICE,
  GET_SERVICE,
  DELETE_SERVICE,
  COMMENT,
  PATH_SLUGS,
  COMMENT_TYPE,
} from "../utils";

class CommentService {
  async createComment(
    postId: string,
    content: string,
    parentId: string | null | undefined = undefined
  ) {
    try {
      const response = await POST_SERVICE(
        COMMENT.CREATE_COMMENT,
        JSON.stringify({
          postId,
          content,
          parentId,
          type: parentId ? COMMENT_TYPE.REPLY : COMMENT_TYPE.COMMENT,
        })
      );
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
      const response = await DELETE_SERVICE(
        COMMENT.DELETE_COMMENT.replace(PATH_SLUGS.COMMENTID, commentId)
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
      const response = await GET_SERVICE(
        COMMENT.GET_POST_COMMENTS.replace(PATH_SLUGS.POSTID, postId)
      );

      if (!response.ok) {
        throw new Error("No comments found");
      }
      return (await response.json())?.data;
    } catch (error) {}
  }

  async likeOrDislikeComment(
    commentId: string,
    postId: string,
    like: boolean = true
  ) {
    try {
      const response = await POST_SERVICE(
        COMMENT.LIKE_COMMENT,
        JSON.stringify({
          commentId,
          postId,
          like,
        })
      );

      if (!response.ok) {
        throw new Error("An error occurred");
      }
      return (await response.json())?.data;
    } catch (error) {}
  }

  async getNestedComments(commentId: string) {
    try {
      const response = await GET_SERVICE(
        COMMENT.GET_NESTED_COMMENT.replace(PATH_SLUGS.COMMENTID, commentId)
      );

      if (!response.ok) {
        throw new Error("No comments found");
      }
      return (await response.json())?.data;
    } catch (error) {}
  }
}

export default new CommentService();
