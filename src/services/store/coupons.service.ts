import client from "../../lib/api/client";

/**
 * 스토어 쿠폰 타입
 */
export type StoreCouponType =
  | "CAFE"
  | "CONVENIENT_STORE"
  | "MEAL"
  | "CERTIFICATE"
  | "LIVING"
  | "ETC";

/**
 * 스토어 쿠폰 조회 API
 *
 * GET /api/coupons?type=CAFE
 * type이 null이면 전체 조회
 */
export const getStoreCoupons = async (type: StoreCouponType | null = null) => {
  const res = await client.get("/api/coupons", {
    params: type == null ? undefined : { type },
  });

  return res.data;
};
