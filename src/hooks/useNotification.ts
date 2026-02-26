import { useEffect, useState } from "react";
import {
  getNotification,
  NotificationResponse,
} from "../services/mypage/notification.service";

export function useNotification() {
  const [data, setData] = useState<NotificationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchNotification = async () => {
    try {
      setIsLoading(true);
      const res = await getNotification();

      setData(res);
      setIsError(false);
    } catch (e) {
      console.log("알림 설정 조회 실패", e);
      setIsError(true);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotification();
  }, []);

  return {
    data,
    isLoading,
    isError,
    refetch: fetchNotification,
  };
}
