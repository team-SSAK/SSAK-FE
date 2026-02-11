import client from "../../lib/api/client";

/**
 * 인증 코드 검증 요청 payload
 */
export type EmailAuthReason = string;

export interface LoginRequest {
  email: string;
  code: string;
  type: EmailAuthReason;
}

/**
 * 로그인 API
 *
 * Example request:
 *{
 *  "email": "test@naver.com",
 *  "code": "537603",\
 *  "type": "SIGNUP"
 *}
 */
export const verify = async (request: LoginRequest): Promise<void> => {
  await client.post("/api/email/verify", request);
};
