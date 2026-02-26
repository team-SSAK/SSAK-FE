import { useEffect, useState } from "react";
import { getMe } from "../services/mypage/me.service";

interface Me {
  userNm: string;
  userEmail: string;
}

export function useMe() {
  const [me, setMe] = useState<Me | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await getMe();
        setMe(res);
      } catch (e) {
        console.log("유저 조회 실패", e);
        setMe(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMe();
  }, []);

  return { me, isLoading };
}
