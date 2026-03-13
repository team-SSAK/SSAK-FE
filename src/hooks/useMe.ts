import { useCallback, useEffect, useState } from "react";
import { getMe, patchMe } from "../services/mypage/me.service";

export interface Me {
  userNm: string;
  userEmail: string;
  userProfileImg?: string | null;
}

const isMe = (value: unknown): value is Me => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    typeof item.userNm === "string" &&
    typeof item.userEmail === "string" &&
    (item.userProfileImg === undefined ||
      item.userProfileImg === null ||
      typeof item.userProfileImg === "string")
  );
};

const normalizeMe = (res: unknown): Me | null => {
  if (isMe(res)) {
    return res;
  }

  if (typeof res !== "object" || res === null) {
    return null;
  }

  const wrapped = res as { data?: unknown };
  return isMe(wrapped.data) ? wrapped.data : null;
};

export function useMe() {
  const [me, setMe] = useState<Me | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchMe = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await getMe();
      setMe(normalizeMe(res));
      setIsError(false);
    } catch (e) {
      console.log("유저 조회 실패", e);
      setMe(null);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const updateMe = async (nickname?: string, userProfileImg?: any) => {
    try {
      const res = await patchMe(nickname, userProfileImg);
      const updated = normalizeMe(res);

      if (updated) {
        setMe(updated);
      } else {
        await fetchMe();
      }

      return true;
    } catch (e) {
      console.log("유저 수정 실패", e);
      return false;
    }
  };

  return { me, isLoading, isError, refetch: fetchMe, updateMe };
}
