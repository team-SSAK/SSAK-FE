import client from "../../lib/api/client";

/**
 * 식당별 커뮤니티 조회 API
 * GET /api/community/{restId}
 */
export const getCommunity = async (restaurantId: number | string) => {
  const restId = String(restaurantId).trim();

  if (!restId) {
    throw new Error("restaurantId is required");
  }

  const res = await client.get(`/api/community/${encodeURIComponent(restId)}`);
  return res.data;
};

export const postCommunity = async (
  restaurantId: number | string,
  payload: {
    postVisibility: boolean;
    postTitle: string;
    postContent: string;
    images: string[];
  },
) => {
  const restId = String(restaurantId).trim();

  if (!restId) {
    throw new Error("restaurantId is required");
  }

  const res = await client.post(
    `/api/community/${encodeURIComponent(restId)}`,
    payload,
  );
  return res.data;
};

export const deleteCommunity = async (postId: number) => {
  const res = await client.delete(`/api/community/post/${postId}`);
  return res.data;
};
