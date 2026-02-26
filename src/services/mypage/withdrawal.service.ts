import client from "../../lib/api/client";

/**
 * 탈퇴 사유 불러오기 API
 */
export const getWithdrawal = async () => {
  const res = await client.get("/api/users/withdrawal");
  return res.data;
};
