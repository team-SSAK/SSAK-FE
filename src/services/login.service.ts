import client from "../lib/api/client";
import type { ApiResponse, LoginResponse } from "../lib/api/types";

export interface LoginPayload {
  email: string;
  password: string;
}

export const login = (payload: LoginPayload) =>
  client.post<ApiResponse<LoginResponse>>("/auth/login", payload);

export const logout = () => client.post("/auth/logout");
