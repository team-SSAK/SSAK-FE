import client from "../../lib/api/client";

export const deleteComment = async (commentId: number | string) => {
  const normalizedCommentId = String(commentId).trim();
  const res = await client.delete(
    `/api/community/comment/${encodeURIComponent(normalizedCommentId)}`,
  );
  return res.data;
};

export interface PatchCommentPayload {
  commentContent: string;
}

export const patchComment = async (
  commentId: number | string,
  payload: PatchCommentPayload,
) => {
  const normalizedCommentId = String(commentId).trim();

  if (!normalizedCommentId) {
    throw new Error("commentId is required");
  }

  const commentContent = payload.commentContent.trim();

  if (!commentContent) {
    throw new Error("commentContent is required");
  }

  const res = await client.patch(
    `/api/community/comment/${encodeURIComponent(normalizedCommentId)}`,
    { commentContent },
  );
  return res.data;
};
