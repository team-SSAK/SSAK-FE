import client from "../../lib/api/client";

/**
 * 알림 설정 응답 타입
 */
export interface NotificationResponse {
  eventNotiYn: boolean;
  communityYn: boolean;
  nightYn: boolean;
}

/**
 * 알림 설정 수정 요청 타입
 */
export interface PatchNotificationRequest {
  eventNotiYn: boolean;
  communityYn: boolean;
  nightYn: boolean;
}

/**
 * 알림 설정 조회 API
 */
export const getNotification = async (): Promise<NotificationResponse> => {
  const res = await client.get("/api/users/notification");
  return res.data;
};

/**
 * 알림 설정 수정 API
 */
export const patchNotification = async (
  request: PatchNotificationRequest,
): Promise<NotificationResponse> => {
  const res = await client.patch("/api/users/notification", request);
  return res.data;
};
