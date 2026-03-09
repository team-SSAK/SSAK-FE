// src/hooks/useRestaurantWish.ts

import { useQuery } from "@tanstack/react-query";
import { getRestaurantWish } from "../services/mypage/restaurantswish.service";

export const useRestaurantWish = () =>
  useQuery({
    queryKey: ["restaurantWish"],
    queryFn: getRestaurantWish,
  });
