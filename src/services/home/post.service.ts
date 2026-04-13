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

export const patchPost = async (
  postId: number | string,
  payload: {
    postVisibility: boolean;
    postTitle: string;
    postContent: string;
    newImages: string[];
  },
) => {
  const normalizedPostId = String(postId).trim();

  if (!normalizedPostId) {
    throw new Error("postId is required");
  }

  const formData = new FormData();
  formData.append("postVisibility", String(payload.postVisibility));
  formData.append("postTitle", payload.postTitle);
  formData.append("postContent", payload.postContent);

  for (let index = 0; index < payload.newImages.length; index += 1) {
    const uri = payload.newImages[index];
    const filename = uri.split("/").pop() ?? `image_${index}.jpg`;
    const ext = filename.split(".").pop()?.toLowerCase() ?? "jpg";
    const mimeType = ext === "png" ? "image/png" : "image/jpeg";

    const fileResponse = await fetch(uri);
    const fileBlob = await fileResponse.blob();
    const typedBlob =
      fileBlob.type === mimeType
        ? fileBlob
        : fileBlob.slice(0, fileBlob.size, mimeType);

    formData.append("newImages", typedBlob, filename);
  }

  const res = await client.patch(
    `/api/community/post/${encodeURIComponent(normalizedPostId)}`,
    formData,
  );
  return res.data;
};
