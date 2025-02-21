import { CommentService } from "../services";

interface CommentProps {
  onCommentDelete: () => void;
}

const useCommentList = ({ onCommentDelete }: CommentProps) => {
  const handleDeleteComment = async (commentId: string) => {
    try {
      await CommentService.deleteComment(commentId);
      onCommentDelete();
    } catch (err) {
      console.error((err as Error).message);
    }
  };

  return { handleDeleteComment };
};

export default useCommentList;
