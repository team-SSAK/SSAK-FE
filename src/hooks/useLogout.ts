import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLogout } from "../services/mypage/logout.service";

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postLogout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["me"] });
    },
  });
};
