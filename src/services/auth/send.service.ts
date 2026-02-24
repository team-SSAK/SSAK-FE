import client from "../../lib/api/client";

export type EmailAuthReason = string;

export interface SendEmailRequest {
  email: string;
  type: EmailAuthReason;
}

/**
 * 이메일 인증 코드 발송
 *
 * Example request:
 * {
 *   "email": "test@naver.com",
 *   "type": "SIGNUP"
 * }
 *
 * Response:
 * - 성공/실패는 HTTP status로 판단
 * - response body는 사용하지 않음
 */
export const sendEmail = async (request: SendEmailRequest): Promise<void> => {
  await client.post("/api/email/send", request);
};
