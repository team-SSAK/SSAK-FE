import client from "../../lib/api/client";

interface PostMeasureParams {
  imageUri: string;
  restaurantId?: number;
  latitude?: number;
  longitude?: number;
}

/**
 * 잔반 인식 API
 * POST /api/measure
 * multipart/form-data: file (image), restaurantId, latitude, longitude
 */
export const postMeasure = async ({ imageUri, restaurantId, latitude, longitude }: PostMeasureParams): Promise<unknown> => {
  const formData = new FormData();

  const fileName = imageUri.split("/").pop() ?? "photo.jpg";
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "jpg";
  const mimeType = ext === "png" ? "image/png" : "image/jpeg";

  formData.append("file", {
    uri: imageUri,
    name: fileName,
    type: mimeType,
  } as any);

  if (restaurantId !== undefined) {
    formData.append("restaurantId", String(restaurantId));
  }
  if (latitude !== undefined) {
    formData.append("latitude", String(latitude));
  }
  if (longitude !== undefined) {
    formData.append("longitude", String(longitude));
  }

  const res = await client.post("/api/measure", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 60000,
  });

  return res.data;
};
