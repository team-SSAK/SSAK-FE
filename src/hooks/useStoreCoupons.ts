import { useEffect, useState } from "react";
import {
  getStoreCoupons,
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
