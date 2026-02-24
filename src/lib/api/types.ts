export interface ApiError {
  message: string;
  code?: string;
  [key: string]: any;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  user?: any;
}

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
}
