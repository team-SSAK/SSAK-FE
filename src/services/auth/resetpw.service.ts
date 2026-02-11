import client from "../../lib/api/client";

/**
 * 비밀번호 재설정 요청 payload
 */
export interface ResetpwRequest {
  email: string;
  newPassword: string;
}

export const resetpw = async (request: ResetpwRequest): Promise<void> => {
  await client.post("/api/auth/reset-password", request);
};
