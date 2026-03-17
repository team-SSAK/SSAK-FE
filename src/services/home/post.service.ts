import client from "../../lib/api/client";

export const getPost = async (postId: number | string) => {
  const normalizedPostId = String(postId).trim();

  if (!normalizedPostId) {
    throw new Error("postId is required");
  }

  const res = await client.get(
    `/api/community/post/${encodeURIComponent(normalizedPostId)}`,
  );
  return res.data;
};

export const postPost = async (
  postId: number | string,
  body: { commentContent: string; parentId: number | null },
) => {
  const normalizedPostId = String(postId).trim();

  const res = await client.post(
    `/api/community/post/${encodeURIComponent(normalizedPostId)}`,
    body,
  );
  return res.data;
};

export const deletePost = async (postId: number | string) => {
  const normalizedPostId = String(postId).trim();
  const res = await client.delete(
    `/api/community/post/${encodeURIComponent(normalizedPostId)}`,
  );
  return res.data;
};
