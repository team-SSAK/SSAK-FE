import client from "../../lib/api/client";

/**
 * 전체 식당 조회 API
 */
export const getRestaurant = async () => {
  const res = await client.get("/api/restaurants");
  return res.data;
};

/**
 * 식당 상세 조회 API (좌표 포함)
 */
export const getRestaurantById = async (restaurantId: number) => {
  const res = await client.get(`/api/restaurants/${restaurantId}`);
  return res.data;
};

/**
 * 식당 찜하기 API
 *
 * POST /api/restaurants/wish
 */
export const postRestaurantWish = async (restaurantId: number) => {
  const res = await client.post("/api/restaurants/wish", {
    wishRestaurantId: restaurantId,
  });

  return res.data;
};
