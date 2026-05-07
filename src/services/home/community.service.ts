import client from "../../lib/api/client";

const LOCAL_URI_PREFIXES = [
  "file://",
  "content://",
  "ph://",
  "assets-library://",
];

const isLocalImageUri = (uri: string) =>
  LOCAL_URI_PREFIXES.some((prefix) => uri.startsWith(prefix));

const createImagePart = (uri: string, index: number) => {
  const filename = uri.split("/").pop() ?? `image_${index}.jpg`;
  const ext = filename.split(".").pop()?.toLowerCase() ?? "jpg";
  const mimeType = ext === "png" ? "image/png" : "image/jpeg";

  return {
    uri,
    name: filename,
    type: mimeType,
  };
};

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
    const filePart = createImagePart(uri, index);

    try {
      if (isLocalImageUri(uri)) {
        formData.append("images", filePart as any);
      } else {
        const fileResponse = await fetch(uri);

        if (!fileResponse.ok) {
          throw new Error(
            `Fetch failed: ${fileResponse.status} ${fileResponse.statusText}`,
          );
        }

        const fileBlob = await fileResponse.blob();
        const finalBlob =
          fileBlob.type === filePart.type
            ? fileBlob
            : new Blob([fileBlob], { type: filePart.type });

        formData.append("images", finalBlob, filePart.name);
      }
    } catch (error) {
      throw error;
    }
  }
  const res = await client.post(
    `/api/community/${encodeURIComponent(restId)}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return res.data;
};

export const deleteCommunity = async (postId: number) => {
  const res = await client.delete(`/api/community/post/${postId}`);
  return res.data;
};
