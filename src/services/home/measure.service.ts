import client from "../../lib/api/client";

/**
 * 잔반 인식 API
 * POST /api/measure
 * multipart/form-data: file (image)
 */
export const postMeasure = async (imageUri: string): Promise<unknown> => {
  const formData = new FormData();

  const fileName = imageUri.split("/").pop() ?? "photo.jpg";
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "jpg";
  const mimeType = ext === "png" ? "image/png" : "image/jpeg";

  formData.append("file", {
    uri: imageUri,
    name: fileName,
    type: mimeType,
  } as any);

  const res = await client.post("/api/measure", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 60000,
  });

  return res.data;
};
