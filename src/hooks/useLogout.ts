import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postLogout } from "../services/mypage/logout.service";
import { clearAll } from "../utils/storage";

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postLogout,
    onSuccess: async () => {
      await clearAll();
      queryClient.removeQueries({ queryKey: ["me"] });
      queryClient.removeQueries({ queryKey: ["liked-post-ids"] });
      queryClient.removeQueries({ queryKey: ["community"] });
      queryClient.removeQueries({ queryKey: ["post"] });
    },
  });
};
