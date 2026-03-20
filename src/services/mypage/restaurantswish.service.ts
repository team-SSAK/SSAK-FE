import client from "../../lib/api/client";

/**
 * 즐겨찾기한 식당 조회 API
 */
export const getRestaurantWish = async () => {
  const res = await client.get("/api/restaurants/wish");
  return res.data;
};

/**
 * 식당 찜하기 API
 *
 * POST /api/restaurants/wish


export const postRestaurantWish = async (couponId: number) => {
  const res = await client.post("/api/restaurants/wish", {
    wishRestaurantId: restaurantId,
  });

  return res.data;
}; */

/**
 * 쿠폰 찜하기 API
 *
 * POST /api/coupons/my/wish

export const postCouponWish = async (couponId: number) => {
  const res = await client.post("/api/coupons/my/wish", {
    wishCouponId: couponId,
  });

  return res.data;
}; */
