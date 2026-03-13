import client from "../../lib/api/client";

/**
 * 탈퇴 사유 불러오기 API
 */
export const getWithdrawal = async () => {
  const res = await client.get("/api/users/withdrawal");
  return res.data;
};

/**
 * 탈퇴 API
 */
export const postWithdrawal = async (
  selectedWdReasonId: string,
  reason: string = "",
) => {
  const res = await client.post("/api/users/withdrawal", {
    selectedWdReasonId,
    reason,
  });

  return res.data;
};
