import { useEffect, useState } from "react";
import {
  getStoreCouponDetail,
  getStoreCoupons,
  StoreCouponDetail,
  StoreCouponType,
} from "../services/store/coupons.service";

interface StoreCouponApiResponse {
  id?: number;
  couponId?: number;
  couponHistId?: number;
  wishCouponId?: number;
  couponNm?: string;
  couponName?: string;
  couponStore?: string;
  storeName?: string;
  couponPoint?: number;
  point?: number;
  couponImgUrl?: string;
  imageUrl?: string;
}

export interface StoreCouponItem {
  id: number;
  storeName: string;
  title: string;
  price: string;
  image?: string;
}

export function useStoreCoupons(type: StoreCouponType | null = null) {
  const [coupons, setCoupons] = useState<StoreCouponItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      setLoading(true);
      try {
        const data = await getStoreCoupons(type);
        const list: StoreCouponApiResponse[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : Array.isArray(data?.content)
              ? data.content
              : [];

        const transformed: StoreCouponItem[] = [];

        list.forEach((item: StoreCouponApiResponse, index: number) => {
          const apiId =
            item.couponHistId ?? item.wishCouponId ?? item.couponId ?? item.id;
          // 일부 /api/coupons 응답은 id가 없어서, 화면 렌더링용 임시 id를 부여한다.
          const id = typeof apiId === "number" ? apiId : -(index + 1);

          const point = item.couponPoint ?? item.point ?? 0;

          transformed.push({
            id,
            storeName: item.couponStore ?? item.storeName ?? "",
            title: item.couponNm ?? item.couponName ?? "",
            price: point + "P",
            image: item.couponImgUrl ?? item.imageUrl,
          });
        });

        setCoupons(transformed);
      } catch (e) {
        console.log("스토어 쿠폰 조회 실패", e);
        setCoupons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, [type]);

  return { coupons, loading };
}

const normalizeStoreCouponDetail = (res: unknown): StoreCouponDetail | null => {
  if (typeof res !== "object" || res === null) {
    return null;
  }

  const data = res as Record<string, unknown>;
  const wrapped =
    typeof data.data === "object" && data.data !== null
      ? (data.data as Record<string, unknown>)
      : null;
  const source = wrapped ?? data;

  const couponId = Number(source.couponId);
  const couponPoint = Number(source.couponPoint);
  const couponValidTerm = Number(source.couponValidTerm);

  if (!Number.isFinite(couponId)) {
    return null;
  }

  return {
    couponId,
    couponName: typeof source.couponName === "string" ? source.couponName : "",
    couponDescription:
      typeof source.couponDescription === "string"
        ? source.couponDescription
        : "",
    couponPoint: Number.isFinite(couponPoint) ? couponPoint : 0,
    couponType:
      source.couponType === "CAFE" ||
      source.couponType === "CONVENIENT_STORE" ||
      source.couponType === "MEAL" ||
      source.couponType === "CERTIFICATE" ||
      source.couponType === "LIVING" ||
      source.couponType === "ETC"
        ? source.couponType
        : "ETC",
    couponStore:
      typeof source.couponStore === "string" ? source.couponStore : "",
    couponImgUrl:
      typeof source.couponImgUrl === "string" ? source.couponImgUrl : "",
    couponValidTerm: Number.isFinite(couponValidTerm) ? couponValidTerm : 0,
    couponWished:
      typeof source.couponWished === "boolean"
        ? source.couponWished
        : undefined,
  };
};

export function useStoreCouponDetail(couponId: number | null) {
  const [coupon, setCoupon] = useState<StoreCouponDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchCouponDetail = async () => {
      if (!couponId || Number.isNaN(couponId) || couponId <= 0) {
        setCoupon(null);
        setLoading(false);
        setIsError(true);
        return;
      }

      setLoading(true);

      try {
        const data = await getStoreCouponDetail(couponId);
        setCoupon(normalizeStoreCouponDetail(data));
        setIsError(false);
      } catch (e) {
        console.log("쿠폰 상세 조회 실패", e);
        setCoupon(null);
        setIsError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCouponDetail();
  }, [couponId]);

  return { coupon, loading, isError };
}
