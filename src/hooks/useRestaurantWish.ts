// src/hooks/useRestaurantWish.ts

import { useQuery } from "@tanstack/react-query";
import { getRestaurantWish } from "../services/mypage/restaurantswish.service";

export interface RestaurantWish {
  restaurantWishId: number;
  restaurantId: number;
  restaurantName: string;
  restaurantLocation: string;
  restaurantImgUrl: string;
}

const isRestaurantWish = (value: unknown): value is RestaurantWish => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    typeof item.restaurantWishId === "number" &&
    typeof item.restaurantId === "number" &&
    typeof item.restaurantName === "string" &&
    typeof item.restaurantLocation === "string" &&
    typeof item.restaurantImgUrl === "string"
  );
};

const normalizeRestaurantWishes = (res: unknown): RestaurantWish[] => {
  const wrapped =
    typeof res === "object" && res !== null
      ? (res as { data?: unknown })
      : null;

  const list = Array.isArray(res)
    ? res
    : wrapped && Array.isArray(wrapped.data)
      ? wrapped.data
      : [];

  return list.filter(isRestaurantWish);
};

export const useRestaurantWish = () =>
  useQuery({
    queryKey: ["restaurantWish"],
    queryFn: getRestaurantWish,
    select: normalizeRestaurantWishes,
  });
