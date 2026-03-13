// src/hooks/useSignup.ts
import { useMutation } from "@tanstack/react-query";
import { signup, SignupRequest } from "../services/auth/signup.service";

export const useSignup = () =>
  useMutation({
    mutationFn: (payload: SignupRequest) => signup(payload),
  });
