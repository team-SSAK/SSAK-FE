import client from "../../lib/api/client";

/**
 * 즐겨찾기한 식당 조회 API
 */
export const getRestaurantWish = async () => {
  const res = await client.get("/api/restaurants/wish");
  return res.data;
};
