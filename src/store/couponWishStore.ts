import { create } from "zustand";
import { postCouponWish } from "../services/mypage/coupons.service";
import {
  addWishedCouponId,
  getWishedCouponIds,
  removeWishedCouponId,
} from "../utils/storage";

interface CouponWishState {
  wishedIds: Set<number>;
  loaded: boolean;
  load: () => Promise<void>;
  isWished: (couponId: number) => boolean;
  toggle: (couponId: number) => Promise<void>;
  setWished: (couponId: number, wished: boolean) => void;
}

export const useCouponWishStore = create<CouponWishState>((set, get) => ({
  wishedIds: new Set(),
  loaded: false,

  load: async () => {
    if (get().loaded) return;
    try {
      const ids = await getWishedCouponIds();
      set({ wishedIds: new Set(ids), loaded: true });
    } catch (e) {
      console.error("찜 목록 로드 실패:", e);
      set({ loaded: true });
    }
  },

  isWished: (couponId) => get().wishedIds.has(couponId),

  setWished: (couponId, wished) => {
    set((state) => {
      const next = new Set(state.wishedIds);
      if (wished) {
        next.add(couponId);
      } else {
        next.delete(couponId);
      }
      return { wishedIds: next };
    });
  },

  toggle: async (couponId: number) => {
    if (!Number.isFinite(couponId) || couponId <= 0) return;

    const current = get().wishedIds.has(couponId);
    const next = !current;

    // 낙관적 업데이트
    get().setWished(couponId, next);

    try {
      await postCouponWish(couponId);
      if (next) {
        await addWishedCouponId(couponId);
      } else {
        await removeWishedCouponId(couponId);
      }
    } catch (e) {
      // 실패 시 롤백
      get().setWished(couponId, current);
      console.error("쿠폰 찜하기/해제 실패:", e);
    }
  },
}));
