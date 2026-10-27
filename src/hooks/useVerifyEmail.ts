// src/hooks/useVerifyEmail.ts
import { useMutation } from "@tanstack/react-query";
import { VerifyRequest, verify } from "../services/auth/verify.service";

export const useVerifyEmail = () =>
  useMutation({
    mutationFn: (payload: VerifyRequest) => verify(payload),
  });
