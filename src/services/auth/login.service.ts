import client from "../../lib/api/client";
import { setAccessToken, setRefreshToken } from "../../utils/storage";

/**
 * 로그인 요청 payload
 */
export interface LoginRequest {
  userEmail: string;
  userPw: string;
}

/**
 * 로그인 API
 */
export const login = async (request: LoginRequest) => {
  const res = await client.post("/api/auth/login", request);

  const accessToken = res.data.accessToken;
  const refreshToken = res.data.refreshToken;

  await setAccessToken(accessToken);

  if (refreshToken) {
    await setRefreshToken(refreshToken);
  }

  return res.data;
};
