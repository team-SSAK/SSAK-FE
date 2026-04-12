import client from "../../lib/api/client";

/**
 * 연동로그인 토큰 요청 payload
 */
export interface AuthTokenRequest {
  code: string;
}

export interface AuthTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export const requestAuthToken = async (
  request: AuthTokenRequest,
): Promise<AuthTokenResponse> => {
  const res = await client.post<AuthTokenResponse>("/api/auth/token", request);
  return res.data;
};

export const submitSocialNickname = async (nickname: string): Promise<void> => {
  const formData = new FormData();
  formData.append("nickname", nickname);

  await client.patch("/api/users/me", formData);
};

// Backward compatibility for existing imports.
export const resetpw = requestAuthToken;
