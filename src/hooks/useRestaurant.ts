import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getRestaurant,
  getRestaurantById,
  postRestaurantWish,
} from "../services/home/restaurent.service";

export type RestaurantType = "FOODCOURT" | string | null;

export interface Restaurant {
  restaurantId: number;
  restaurantName: string;
  restaurantLocation: string;
  restaurantImgUrl: string;
  restaurantType: RestaurantType;
  wished: boolean;
}

const isRestaurant = (value: unknown): value is Restaurant => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    typeof item.restaurantId === "number" &&
    typeof item.restaurantName === "string" &&
    typeof item.restaurantLocation === "string" &&
    typeof item.restaurantImgUrl === "string" &&
    (item.restaurantType === undefined ||
      typeof item.restaurantType === "string" ||
      item.restaurantType === null) &&
    typeof item.wished === "boolean"
  );
};

const normalizeRestaurants = (res: unknown): Restaurant[] => {
  const wrapped =
    typeof res === "object" && res !== null
      ? (res as { data?: unknown })
      : null;

  const list = Array.isArray(res)
    ? res
    : wrapped && Array.isArray(wrapped.data)
      ? wrapped.data
      : [];

  return list.filter(isRestaurant);
};

export const useRestaurant = () =>
  useQuery({
    queryKey: ["restaurant"],
    queryFn: getRestaurant,
    select: normalizeRestaurants,
  });

export interface RestaurantDetail {
  restaurantId: number;
  restaurantName: string;
  restaurantLocation: string;
  restaurantType: RestaurantType;
  restaurantImgUrl: string;
  openTime: { hour: number; minute: number } | null;
  closeTime: { hour: number; minute: number } | null;
}

const normalizeRestaurantDetail = (res: unknown): RestaurantDetail | null => {
  if (typeof res !== "object" || res === null) return null;
  const d = res as Record<string, any>;
  return {
    restaurantId: d.restaurantId,
    restaurantName: d.restaurantName ?? "",
    restaurantLocation: d.restaurantLocation ?? "",
    restaurantType: d.restaurantType ?? null,
    restaurantImgUrl: d.restaurantImgUrl ?? "",
    openTime: d.openTime ?? null,
    closeTime: d.closeTime ?? null,
  };
};

export const useRestaurantDetail = (restaurantId: number) =>
  useQuery({
    queryKey: ["restaurant", restaurantId],
    queryFn: () => getRestaurantById(restaurantId),
    select: normalizeRestaurantDetail,
    enabled: !isNaN(restaurantId),
  });

export const usePostRestaurantWish = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postRestaurantWish,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["restaurant"] });
      queryClient.invalidateQueries({ queryKey: ["restaurantWish"] });
    },
  });
};
