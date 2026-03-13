import client from "../../lib/api/client";

/**
 * 유저 포인트 정보 조회 API
 */
export const getCurrentPoint = async () => {
  const res = await client.get("/api/users/current-point");
  return res.data;
};

/**
 * 포인트 타입
 */
export type PointOption = "SAVE" | "USE" | "REFUND";

/**
 * 포인트 조회 API
 *
 * GET /api/users/point
 * GET /api/users/point?option=SAVE
 */
export const getPoints = async (option?: PointOption) => {
  const res = await client.get("/api/users/point", {
    params: option ? { option } : undefined,
  });

  return res.data;
};
