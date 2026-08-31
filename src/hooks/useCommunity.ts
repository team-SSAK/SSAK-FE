import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteCommunity,
  getCommunity,
  postCommunity,
} from "../services/home/community.service";
import { normalizeImageList } from "../utils/image";

export interface CommunityItem {
  postId: number;
  postTitle?: string;
  postContent: string;
  postVisibility: boolean;
  nickname: string;
  authorProfileImg?: string | null;
  isOwner?: boolean;
  postCreateTime: string;
  postLikeCnt: number;
  postCommentCnt: number;
  imageUrls?: string[];
}

const collectImageCandidates = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.flatMap((item) => {
      if (typeof item === "string") {
        return [item];
      }

      if (typeof item === "object" && item !== null) {
        const objectItem = item as Record<string, unknown>;
        const nested =
          objectItem.imageUrl ??
          objectItem.url ??
          objectItem.postImage ??
          objectItem.postImgUrl ??
          objectItem.src;

        return typeof nested === "string" ? [nested] : [];
      }

      return [];
    });
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) {
      return [];
    }

    if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
      try {
        const parsed = JSON.parse(trimmed);
        return collectImageCandidates(parsed);
      } catch {
        return [trimmed];
      }
    }

    return [trimmed];
  }

  if (typeof value === "object" && value !== null) {
    const objectValue = value as Record<string, unknown>;
    const nested =
      objectValue.imageUrl ??
      objectValue.url ??
      objectValue.postImage ??
      objectValue.postImgUrl ??
      objectValue.src;

    return typeof nested === "string" ? [nested] : [];
  }

  return [];
};

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

  return list
    .map((value) => {
      if (typeof value !== "object" || value === null) {
        return null;
      }

      const item = value as Record<string, unknown>;
      const rawImageList =
        item.imageUrls ?? item.images ?? item.postImages ?? item.postImgUrls;
      const singleImage = item.imageUrl ?? item.postImage ?? item.postImgUrl;

      const imageCandidates = [
        ...collectImageCandidates(rawImageList),
        ...collectImageCandidates(singleImage),
        ...collectImageCandidates(item.thumbnailUrl),
        ...collectImageCandidates(item.thumbUrl),
      ];
      const imageUrls = normalizeImageList(imageCandidates);

      const rawAuthorProfile =
        item.authorProfileImg ??
        item.userProfileImg ??
        item.profileImg ??
        item.userProfileImage ??
        item.profileImage ??
        item.writerProfileImg;

      const normalized: CommunityItem = {
        postId: Number(item.postId),
        postTitle:
          typeof item.postTitle === "string" ? item.postTitle : undefined,
        postContent:
          typeof item.postContent === "string" ? item.postContent : "",
        postVisibility:
          typeof item.postVisibility === "boolean" ? item.postVisibility : true,
        nickname: typeof item.nickname === "string" ? item.nickname : "",
        authorProfileImg:
          typeof rawAuthorProfile === "string"
            ? resolveImageOrNull(rawAuthorProfile)
            : null,
        isOwner: item.isOwner === true,
        postCreateTime:
          typeof item.postCreateTime === "string" ? item.postCreateTime : "",
        postLikeCnt:
          typeof item.postLikeCnt === "number" ? item.postLikeCnt : 0,
        postCommentCnt:
          typeof item.postCommentCnt === "number" ? item.postCommentCnt : 0,
        imageUrls,
      };

      return isCommunityItem(normalized) ? normalized : null;
    })
    .filter((item): item is CommunityItem => item !== null);
};

const resolveImageOrNull = (raw: string): string | null => {
  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }

  return normalizeImageList([trimmed])[0] ?? null;
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
