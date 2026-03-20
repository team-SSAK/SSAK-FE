import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteCommunity,
  getCommunity,
  postCommunity,
} from "../services/home/community.service";

export interface CommunityItem {
  postId: number;
  postTitle?: string;
  postContent: string;
  postVisibility: boolean;
  nickname: string;
  postCreateTime: string;
  postLikeCnt: number;
  postCommentCnt: number;
  imageUrls?: string[];
}

const isCommunityItem = (value: unknown): value is CommunityItem => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    typeof item.postId === "number" &&
    (typeof item.postTitle === "string" ||
      typeof item.postTitle === "undefined") &&
    typeof item.postContent === "string" &&
    typeof item.postVisibility === "boolean" &&
    typeof item.nickname === "string" &&
    typeof item.postCreateTime === "string" &&
    typeof item.postLikeCnt === "number" &&
    typeof item.postCommentCnt === "number" &&
    (item.imageUrls === undefined ||
      (Array.isArray(item.imageUrls) &&
        item.imageUrls.every((value) => typeof value === "string")))
  );
};

const normalizeCommunity = (res: unknown): CommunityItem[] => {
  const wrapped =
    typeof res === "object" && res !== null
      ? (res as { data?: unknown })
      : null;

  const list = Array.isArray(res)
    ? res
    : wrapped && Array.isArray(wrapped.data)
      ? wrapped.data
      : [];

  return list.filter(isCommunityItem);
};

export const useCommunity = (restaurantId?: number | string) =>
  useQuery({
    queryKey: ["community", String(restaurantId ?? "")],
    queryFn: () => getCommunity(restaurantId as number | string),
    enabled:
      restaurantId !== undefined &&
      restaurantId !== null &&
      String(restaurantId).trim().length > 0,
    select: normalizeCommunity,
  });

export interface PostCommunityPayload {
  postVisibility: boolean;
  postTitle: string;
  postContent: string;
  images: string[];
}

export const usePostCommunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: {
      restaurantId: number | string;
      payload: PostCommunityPayload;
    }) => postCommunity(variables.restaurantId, variables.payload),
    onSuccess: (_, variables) => {
      // Invalidate community query to refetch posts
      queryClient.invalidateQueries({
        queryKey: ["community", String(variables.restaurantId ?? "")],
      });
    },
  });
};

export const useDeleteCommunity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: {
      postId: number;
      restaurantId: number | string;
    }) => deleteCommunity(variables.postId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["community", String(variables.restaurantId ?? "")],
      });
    },
  });
};
