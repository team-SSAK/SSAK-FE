import client from "../../lib/api/client";

/**
 * 로그인 요청 payload
 */
export interface SignupRequest {
  userEmail: string;
  userPw: string;
  userNm: string;
  marketAgreeYn: boolean;
}

/**
 * 로그인 API
 *
 * Example request:
 * {
 *   "userEmail": "test@example.com",
 *   "userPw": "password1234"
 * }
 */
export const signup = async (request: SignupRequest): Promise<void> => {
  await client.post("/api/auth/signup", request);
};
