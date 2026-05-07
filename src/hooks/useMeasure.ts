import { useMutation } from "@tanstack/react-query";
import { postMeasure } from "../services/home/measure.service";

export const useMeasure = () => {
  return useMutation({
    mutationFn: (imageUri: string) => postMeasure(imageUri),
  });
};
