import client from "../../lib/api/client";

/**
 * 유저 포인트 정보 조회 API
 */
export const getCurrentPoint = async () => {
  const res = await client.get("/api/users/current-point");
  return res.data;
};
