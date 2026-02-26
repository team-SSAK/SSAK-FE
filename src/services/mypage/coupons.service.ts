import client from "../../lib/api/client";

/**
 * 쿠폰 상태
 */
export type CouponOption = "ISSUED" | "USED";

/**
 * 쿠폰 조회 API
 *
 * GET /api/coupons?option=ISSUED
 */
export const getCoupons = async (option: CouponOption) => {
  const res = await client.get("/api/coupons/my", {
    params: { option },
  });

  return res.data;
};
