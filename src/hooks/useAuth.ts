import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { LoginPayload } from "../services/login.service";
import * as authService from "../services/login.service";
import * as storage from "../utils/storage";

export const useLogin = () => {
  const qc = useQueryClient();
  return useMutation((payload: LoginPayload) => authService.login(payload), {
    onSuccess: async (res) => {
      // server shape: ApiResponse<LoginResponse>
      const payload = res.data.data;
      if (payload?.accessToken)
        await storage.setAccessToken(payload.accessToken);
      if (payload?.refreshToken)
        await storage.setRefreshToken(payload.refreshToken ?? "");

      // 예: 유저 정보 쿼리 무효화 등
      qc.invalidateQueries(["me"]);
    },
  });
};
