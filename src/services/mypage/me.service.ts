import client from "../../lib/api/client";

/**
 * 로그인 유저 정보 조회 API
 */
export const getMe = async () => {
  const res = await client.get("/api/users/me");
  return res.data;
};
