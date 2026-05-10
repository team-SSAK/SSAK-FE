import { useEffect, useState } from "react";
import {
  CouponOption,
  getCoupons,
  getCouponWishes,
  postCouponWish,
} from "../services/mypage/coupons.service";

interface CouponApiResponse {
  couponId?: number;
  couponHistId?: number;
  couponWishId?: number;
  couponNm: string;
  couponStore: string;
  couponPoint: number;
  couponImgUrl: string;
  couponWished?: boolean;
}

export interface CouponItem {
  id: number;
  couponId: number;
  couponHistId?: number;
  couponWishId?: number;
  storeName: string;
  title: string;
  price: string;
  image?: string;
  wished?: boolean;
}

export function useCoupons(status: CouponOption = "ISSUED") {
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const data = await getCoupons(status);
        const list = Array.isArray(data) ? data : (data?.data ?? []);

        const transformed: CouponItem[] = list.map(
          (item: CouponApiResponse, index: number) => ({
            id: item.couponHistId ?? -(index + 1),
            couponId: item.couponId ?? 0,
            couponHistId: item.couponHistId,
            couponWishId: item.couponWishId,
            storeName: item.couponStore,
            title: item.couponNm,
            price: item.couponPoint + "P",
            image: item.couponImgUrl,
            wished: item.couponWished,
          }),
        );

        setCoupons(transformed);
      } catch (e) {
        console.log("쿠폰 조회 실패", e);
        setCoupons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, [status]);

  const addWish = async (couponId: number) => {
    try {
      await postCouponWish(couponId);
      return true;
    } catch (e) {
      console.log("쿠폰 찜하기 실패", e);
      return false;
    }
  };

  return { coupons, loading, isLoading: loading, addWish };
}

export function useCouponWishes() {
  const [wishCoupons, setWishCoupons] = useState<CouponItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishCoupons = async () => {
      try {
        const data = await getCouponWishes();
        const list = Array.isArray(data) ? data : (data?.data ?? []);

        const transformed: CouponItem[] = list.map(
          (item: CouponApiResponse, index: number) => ({
            id:
              item.couponWishId ??
              item.couponHistId ??
              item.couponId ??
              -(index + 1),
            couponId: item.couponId ?? 0,
            couponHistId: item.couponHistId,
            couponWishId: item.couponWishId,
            storeName: item.couponStore,
            title: item.couponNm,
            price: item.couponPoint + "P",
            image: item.couponImgUrl,
            wished: item.couponWished,
          }),
        );

        setWishCoupons(transformed);
      } catch (e) {
        console.log("찜한 쿠폰 조회 실패", e);
        setWishCoupons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishCoupons();
  }, []);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await getCouponWishes();
      const list = Array.isArray(data) ? data : (data?.data ?? []);

      const transformed: CouponItem[] = list.map(
        (item: CouponApiResponse, index: number) => ({
          id:
            item.couponWishId ??
            item.couponHistId ??
            item.couponId ??
            -(index + 1),
          couponId: item.couponId ?? 0,
          couponHistId: item.couponHistId,
          couponWishId: item.couponWishId,
          storeName: item.couponStore,
          title: item.couponNm,
          price: item.couponPoint + "P",
          image: item.couponImgUrl,
          wished: item.couponWished,
        }),
      );

      setWishCoupons(transformed);
    } catch (e) {
      console.log("찜한 쿠폰 조회 실패", e);
      setWishCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  return { wishCoupons, loading, refresh };
}
