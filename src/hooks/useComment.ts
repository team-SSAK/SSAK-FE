import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteComment, patchComment } from "../services/home/comment.service";

export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: {
      commentId: number | string;
      postId?: number | string;
    }) => deleteComment(variables.commentId),
    onSuccess: (_, variables) => {
      if (variables.postId !== undefined && variables.postId !== null) {
        queryClient.invalidateQueries({
          queryKey: ["post", String(variables.postId)],
        });
      }

      queryClient.invalidateQueries({ queryKey: ["community"] });
    },
  });
};

export const usePatchComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: {
      commentId: number | string;
      postId?: number | string;
      commentContent: string;
    }) =>
      patchComment(variables.commentId, {
        commentContent: variables.commentContent,
      }),
    onSuccess: (_, variables) => {
      if (variables.postId !== undefined && variables.postId !== null) {
        queryClient.invalidateQueries({
          queryKey: ["post", String(variables.postId)],
        });
      }

      queryClient.invalidateQueries({ queryKey: ["community"] });
    },
  });
};
