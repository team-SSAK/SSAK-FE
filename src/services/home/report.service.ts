import client from "../../lib/api/client";

export interface ReportPayload {
  reportContent: string;
}

export const postReport = async (
  postId: number | string,
  payload: ReportPayload,
) => {
  const normalizedPostId = String(postId).trim();

  if (!normalizedPostId) {
    throw new Error("postId is required");
  }

  const reportContent = payload.reportContent.trim();

  if (!reportContent) {
    throw new Error("reportContent is required");
  }

  const res = await client.post(
    `/api/community/post/${encodeURIComponent(normalizedPostId)}/report`,
    { reportContent },
  );
  return res.data;
};

export const postReportComment = async (
  commentId: number | string,
  payload: ReportPayload,
) => {
  const normalizedCommentId = String(commentId).trim();

  if (!normalizedCommentId) {
    throw new Error("postId is required");
  }

  const reportContent = payload.reportContent.trim();

  if (!reportContent) {
    throw new Error("reportContent is required");
  }

  const res = await client.post(
    `/api/community/comment/${encodeURIComponent(normalizedCommentId)}/report`,
    { reportContent },
  );
  return res.data;
};
