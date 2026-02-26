import { useEffect, useState } from "react";
import { getCurrentPoint } from "../services/mypage/currentpoint.service";

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
