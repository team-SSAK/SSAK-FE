import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getRestaurant,
  getRestaurantById,
  getRestaurantMenuById,
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
  latitude: number | null;
  longitude: number | null;
}

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

  return list
    .filter(
      (value): value is Record<string, unknown> =>
        typeof value === "object" && value !== null,
    )
    .map((item) => {
      const lat = Number(item.latitude ?? item.lat);
      const lon = Number(item.longitude ?? item.lng ?? item.lon);
      return {
        restaurantId: Number(item.restaurantId),
        restaurantName: typeof item.restaurantName === "string" ? item.restaurantName : "",
        restaurantLocation: typeof item.restaurantLocation === "string" ? item.restaurantLocation : "",
        restaurantImgUrl: typeof item.restaurantImgUrl === "string" ? item.restaurantImgUrl : "",
        restaurantType: (typeof item.restaurantType === "string" ? item.restaurantType : null) as RestaurantType,
        wished: item.wished === true || item.isWished === true,
        latitude: Number.isFinite(lat) && lat !== 0 ? lat : null,
        longitude: Number.isFinite(lon) && lon !== 0 ? lon : null,
      };
    })
    .filter((r) => r.restaurantId > 0);
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
  restaurantCoord: { lat: number; lon: number } | null;
  openTime: { hour: number; minute: number } | string | null;
  closeTime: { hour: number; minute: number } | string | null;
}

const normalizeRestaurantCoord = (
  detail: Record<string, unknown>,
): { lat: number; lon: number } | null => {
  const coord = detail.restaurantCoord;

  if (typeof coord !== "object" || coord === null) {
    const lat = Number(detail.latitude ?? detail.lat);
    const lon = Number(detail.longitude ?? detail.lng ?? detail.lon);

    if (Number.isFinite(lat) && Number.isFinite(lon)) {
      return { lat, lon };
    }

    return null;
  }

  const c = coord as Record<string, unknown>;
  const x = Number(c.x);
  const y = Number(c.y);

  // API uses JTS Point: x=longitude, y=latitude
  if (Number.isFinite(x) && Number.isFinite(y)) {
    return { lat: y, lon: x };
  }

  const lat = Number(c.latitude ?? c.lat);
  const lon = Number(c.longitude ?? c.lng ?? c.lon);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return null;
  }

  return { lat, lon };
};

const normalizeRestaurantDetail = (res: unknown): RestaurantDetail | null => {
  if (typeof res !== "object" || res === null) return null;
  const d = res as Record<string, any>;
  return {
    restaurantId: d.restaurantId,
    restaurantName: d.restaurantName ?? "",
    restaurantLocation: d.restaurantLocation ?? "",
    restaurantType: d.restaurantType ?? null,
    restaurantImgUrl: d.restaurantImgUrl ?? "",
    restaurantCoord: normalizeRestaurantCoord(d),
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

export interface RestaurantMenu {
  menuId: number;
  menuType: string;
  menuItems: string[];
}

const normalizeRestaurantMenus = (res: unknown): RestaurantMenu[] => {
  const wrapped =
    typeof res === "object" && res !== null
      ? (res as { data?: unknown; content?: unknown })
      : null;

  const list = Array.isArray(res)
    ? res
    : wrapped && Array.isArray(wrapped.data)
      ? wrapped.data
      : wrapped && Array.isArray(wrapped.content)
        ? wrapped.content
        : [];

  return list
    .map((item) => {
      if (typeof item !== "object" || item === null) {
        return null;
      }

      const d = item as Record<string, unknown>;
      const menuId = Number(d.menuId);
      const menuItems = Array.isArray(d.menuItems)
        ? d.menuItems.filter((x): x is string => typeof x === "string")
        : [];

      if (!Number.isFinite(menuId)) {
        return null;
      }

      return {
        menuId,
        menuType: typeof d.menuType === "string" ? d.menuType : "",
        menuItems,
      };
    })
    .filter((item): item is RestaurantMenu => item !== null);
};

export const useRestaurantMenu = (restaurantId: number) =>
  useQuery({
    queryKey: ["restaurantMenu", restaurantId],
    queryFn: () => getRestaurantMenuById(restaurantId),
    select: normalizeRestaurantMenus,
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
