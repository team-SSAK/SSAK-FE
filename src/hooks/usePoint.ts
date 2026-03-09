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

  useEffect(() => {
    const fetchPoint = async () => {
      try {
        const res = await getCurrentPoint();
        const currentPoint =
          typeof res === "number" ? res : (res?.point ?? res?.data ?? 0);

        setPoint(currentPoint);
      } catch (e) {
        console.log("포인트 조회 실패", e);
        setPoint(0);
      }
    };

    fetchPoint();
  }, []);

  return { point };
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
