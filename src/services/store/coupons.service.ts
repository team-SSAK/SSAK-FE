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

export interface StoreCouponDetail {
  couponId: number;
  couponName: string;
  couponDescription: string;
  couponPoint: number;
  couponType: StoreCouponType;
  couponStore: string;
  couponImgUrl: string;
  couponValidTerm: number;
}

/**
 * 쿠폰 상세 조회 API
 * GET /api/coupons/{couponId}
 */
export const getStoreCouponDetail = async (couponId: number) => {
  const res = await client.get(`/api/coupons/${couponId}`);
  return res.data;
};

/**
 * 쿠폰 교환 API
 * POST /api/coupons/exchange
 */
export const postCouponExchange = async (exchangeCouponId: number) => {
  const res = await client.post("/api/coupons/exchange", {
    exchangeCouponId,
  });

  return res.data;
};

/**
 * 쿠폰 사용 API
 * POST /api/coupons/use
 */
export const postCouponUse = async (couponHistId: number, storePw: number) => {
  const res = await client.post("/api/coupons/use", {
    couponHistId,
    storePw,
  });

  return res.data;
};
