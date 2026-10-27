import { useMutation } from "@tanstack/react-query";
import { postMeasure } from "../services/home/measure.service";

interface MeasureParams {
  imageUri: string;
  restaurantId?: number;
  latitude?: number;
  longitude?: number;
}

export const useMeasure = () => {
  return useMutation({
    mutationFn: (params: MeasureParams) => postMeasure(params),
  });
};
