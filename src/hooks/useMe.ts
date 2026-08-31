import { useCallback, useEffect, useState } from "react";
import { getMe, patchMe } from "../services/mypage/me.service";

export interface Me {
  userNm: string;
  userEmail: string;
  userProfileImg?: string | null;
  userRole?: "USER" | "OWNER" | "ADMIN" | null;
}

const pickFirstString = (...values: unknown[]): string | undefined => {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value;
    }
  }
  return undefined;
};

const normalizeMeCandidate = (value: unknown): Me | null => {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  const item = value as Record<string, unknown>;
  const userNm = pickFirstString(item.userNm, item.nickname, item.userName);
  const userEmail = pickFirstString(item.userEmail, item.email);
  const userProfileImg =
    pickFirstString(
      item.userProfileImg,
      item.profileImg,
      item.userProfileImage,
      item.profileImage,
    ) ?? null;

  if (!userNm || !userEmail) {
    return null;
  }

  const userRole =
    item.userRole === "USER" || item.userRole === "OWNER" || item.userRole === "ADMIN"
      ? (item.userRole as "USER" | "OWNER" | "ADMIN")
      : null;

  return { userNm, userEmail, userProfileImg, userRole };
};

const isMe = (value: unknown): value is Me => {
  return normalizeMeCandidate(value) !== null;
};

const normalizeMe = (res: unknown): Me | null => {
  const direct = normalizeMeCandidate(res);
  if (direct) {
    return direct;
  }

  if (typeof res !== "object" || res === null) {
    return null;
  }

  const wrapped = res as { data?: unknown; result?: unknown };

  const wrappedData = normalizeMeCandidate(wrapped.data);
  if (wrappedData) {
    return wrappedData;
  }

  return normalizeMeCandidate(wrapped.result);
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
      await patchMe(nickname, userProfileImg);
      // PATCH 응답 스키마가 달라도 최신 이름/이미지를 확실히 동기화하기 위해 항상 재조회한다.
      await fetchMe();

      return true;
    } catch (e) {
      console.log("유저 수정 실패", e);
      return false;
    }
  };

  return { me, isLoading, isError, refetch: fetchMe, updateMe };
}
