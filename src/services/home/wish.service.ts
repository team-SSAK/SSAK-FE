import client from "@/src/lib/api/client";

export const postPostWish = async (likedPostId: number | string) => {
  const normalizedPostId = String(likedPostId).trim();

  if (!normalizedPostId) {
    throw new Error("likedPostId is required");
  }

  const res = await client.post("/api/community/post/wish", {
    likedPostId: Number(normalizedPostId),
  });

  return res.data;
};

export const postCommentWish = async (likedCommentId: number | string) => {
  const normalizedCommentId = String(likedCommentId).trim();

  if (!normalizedCommentId) {
    throw new Error("likedCommentId is required");
  }

  const res = await client.post("/api/community/comment/wish", {
    likedCommentId: Number(normalizedCommentId),
  });

  return res.data;
};
