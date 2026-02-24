import client from "../../lib/api/client";

/**
 * 로그인 요청 payload
 */
export interface LoginRequest {
  userEmail: string;
  userPw: string;
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
export const login = async (request: LoginRequest): Promise<void> => {
  await client.post("/api/auth/login", request);
};
