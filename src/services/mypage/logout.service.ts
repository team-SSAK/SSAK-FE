import client from "../../lib/api/client";

/**
 * 로그아웃 API
 */
export const postLogout = async () => {
  const res = await client.post("/api/auth/logout");
  return res.data;
};
