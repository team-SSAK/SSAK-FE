// src/hooks/useVerifyEmail.ts
import { useMutation } from "@tanstack/react-query";
import { LoginRequest, verify } from "../services/auth/verify.service";

export const useVerifyEmail = () =>
  useMutation({
    mutationFn: (payload: LoginRequest) => verify(payload),
  });
