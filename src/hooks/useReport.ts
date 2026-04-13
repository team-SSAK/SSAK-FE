import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../lib/api/client";
import * as reportService from "../services/home/report.service";

export const useReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: {
      postId: number | string;
      reportContent: string;
    }) =>
      reportService.postReport(variables.postId, {
        reportContent: variables.reportContent,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["post", String(variables.postId)],
      });
      queryClient.invalidateQueries({ queryKey: ["community"] });
    },
  });
};

export const useReportComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: {
      commentId: number | string;
      postId?: number | string;
      reportContent: string;
    }) => {
      const normalizedCommentId = String(variables.commentId).trim();
      const reportContent = variables.reportContent.trim();

      if (!normalizedCommentId) {
        throw new Error("commentId is required");
      }

      if (!reportContent) {
        throw new Error("reportContent is required");
      }

      return client.post(
        `/api/community/comment/${encodeURIComponent(normalizedCommentId)}/report`,
        { reportContent },
      );
    },
    onSuccess: (_, variables) => {
      if (variables.postId !== undefined && variables.postId !== null) {
        queryClient.invalidateQueries({
          queryKey: ["post", String(variables.postId)],
        });
      }

      queryClient.invalidateQueries({ queryKey: ["community"] });
    },
  });
};
