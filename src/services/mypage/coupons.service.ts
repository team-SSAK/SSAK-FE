import client from "../../lib/api/client";

/**
 * 쿠폰 상태
 */
export type CouponOption = "CAFE" | "CONVENIENT_STORE" | "MEAL" | "CERTIFICATE";

/**
 * 쿠폰 조회 API
 *
 * GET /api/coupons/my?option=CAFE
 * option이 null이면 전체 조회
 */
export const getCoupons = async (option: CouponOption | null = null) => {
  const res = await client.get("/api/coupons/my", {
    params: option == null ? undefined : { option },
  });

  return res.data;
};

/**
 * 쿠폰 찜하기 API
 *
 * POST /api/coupons/my/wish
 */
export const postCouponWish = async (couponId: number) => {
  const res = await client.post("/api/coupons/my/wish", {
    wishCouponId: couponId,
  });

  return res.data;
};

/**
 * 쿠폰 찜하기 조회 API
 *
 * GET /api/coupons/my/wish
 */
export const getCouponWishes = async () => {
  const res = await client.get("/api/coupons/my/wish");
  return res.data;
};
