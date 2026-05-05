import client from "../../lib/api/client";

/**
 * 쿠폰 상태
 */
export type CouponOption = "ISSUED" | "USED" | "EXPIRED";

/**
 * 쿠폰 조회 API
 *
 * GET /api/coupons/my?option=ISSUED
 */
export const getCoupons = async (option: CouponOption = "ISSUED") => {
  const res = await client.get("/api/coupons/my", {
    params: { option },
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
