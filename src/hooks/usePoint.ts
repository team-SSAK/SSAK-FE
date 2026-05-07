import { useCallback, useEffect, useState } from "react";
import {
  getCurrentPoint,
  getPoints,
  PointOption,
} from "../services/mypage/point.service";

export interface PointHistory {
  pointHistId: number;
  pointAmount: number;
  pointDesc: string;
  pointType: PointOption;
  pointTime: string | null;
}

const isPointHistory = (value: unknown): value is PointHistory => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    typeof item.pointHistId === "number" &&
    typeof item.pointAmount === "number" &&
    typeof item.pointDesc === "string" &&
    (typeof item.pointTime === "string" || item.pointTime === null) &&
    (item.pointType === "SAVE" ||
      item.pointType === "USE" ||
      item.pointType === "REFUND")
  );
};

const normalizePointHistories = (res: unknown): PointHistory[] => {
  const wrapped =
    typeof res === "object" && res !== null
      ? (res as { data?: unknown })
      : null;

  const list = Array.isArray(res)
    ? res
    : wrapped && Array.isArray(wrapped.data)
      ? wrapped.data
      : [];

  return list.filter(isPointHistory);
};

export function usePoint() {
  const [point, setPoint] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const resolveCurrentPoint = (res: any): number => {
    const candidate =
      typeof res === "number"
        ? res
        : (res?.currentPoint ??
          res?.point ??
          res?.data?.currentPoint ??
          res?.data?.point ??
          res?.data);

    if (typeof candidate === "number" && Number.isFinite(candidate)) {
      return candidate;
    }

    if (typeof candidate === "string") {
      const parsed = Number(candidate);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }

    return 0;
  };

  useEffect(() => {
    const fetchPoint = async () => {
      try {
        setIsLoading(true);
        const res = await getCurrentPoint();
        setPoint(resolveCurrentPoint(res));
        setIsError(false);
      } catch (e) {
        console.log("포인트 조회 실패", e);
        setPoint(0);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPoint();
  }, []);

  return { point, isLoading, isError };
}

export function usePoints(option?: PointOption) {
  const [points, setPoints] = useState<PointHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchPoints = useCallback(
    async (nextOption: PointOption | undefined = option) => {
      try {
        setLoading(true);
        const res = await getPoints(nextOption);

        setPoints(normalizePointHistories(res));
        setIsError(false);
      } catch (e) {
        console.log("포인트 내역 조회 실패", e);
        setPoints([]);
        setIsError(true);
      } finally {
        setLoading(false);
      }
    },
    [option],
  );

  useEffect(() => {
    fetchPoints(option);
  }, [fetchPoints, option]);

  return {
    points,
    loading,
    isError,
    refetch: fetchPoints,
  };
}
