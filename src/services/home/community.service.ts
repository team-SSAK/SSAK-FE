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

  const formData = new FormData();
  formData.append("postVisibility", String(payload.postVisibility));
  formData.append("postTitle", payload.postTitle);
  formData.append("postContent", payload.postContent);

  for (let index = 0; index < payload.images.length; index += 1) {
    const uri = payload.images[index];
    const filename = uri.split("/").pop() ?? `image_${index}.jpg`;
    const ext = filename.split(".").pop()?.toLowerCase() ?? "jpg";
    const mimeType = ext === "png" ? "image/png" : "image/jpeg";

    const fileResponse = await fetch(uri);
    const fileBlob = await fileResponse.blob();
    const typedBlob =
      fileBlob.type === mimeType
        ? fileBlob
        : fileBlob.slice(0, fileBlob.size, mimeType);

    formData.append("images", typedBlob, filename);
  }

  const res = await client.post(
    `/api/community/${encodeURIComponent(restId)}`,
    formData,
  );
  return res.data;
};

export const deleteCommunity = async (postId: number) => {
  const res = await client.delete(`/api/community/post/${postId}`);
  return res.data;
};
