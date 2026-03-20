import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postReport } from "../services/home/report.service";

export const useReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: {
      postId: number | string;
      reportContent: string;
    }) =>
      postReport(variables.postId, { reportContent: variables.reportContent }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["post", String(variables.postId)],
      });
      queryClient.invalidateQueries({ queryKey: ["community"] });
    },
  });
};
