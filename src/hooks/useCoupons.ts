import { useEffect, useState } from "react";
import {
  CouponOption,
  getCoupons,
  getCouponWishes,
  postCouponWish,
} from "../services/mypage/coupons.service";

interface CouponApiResponse {
  couponHistId: number;
  couponNm: string;
  couponStore: string;
  couponPoint: number;
  couponImgUrl: string;
}

export interface CouponItem {
  id: number;
  storeName: string;
  title: string;
  price: string;
  image?: string;
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
          (item: CouponApiResponse) => ({
            id: item.couponHistId,
            storeName: item.couponStore,
            title: item.couponNm,
            price: item.couponPoint + "P",
            image: item.couponImgUrl,
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
          (item: CouponApiResponse) => ({
            id: item.couponHistId,
            storeName: item.couponStore,
            title: item.couponNm,
            price: item.couponPoint + "P",
            image: item.couponImgUrl,
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

      const transformed: CouponItem[] = list.map((item: CouponApiResponse) => ({
        id: item.couponHistId,
        storeName: item.couponStore,
        title: item.couponNm,
        price: item.couponPoint + "P",
        image: item.couponImgUrl,
      }));

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
