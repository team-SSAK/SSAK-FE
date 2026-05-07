import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPost, patchPost, postPost } from "../services/home/post.service";
import { normalizeImageList } from "../utils/image";

export interface CommentItem {
  commentId: number;
  commentContent: string;
  nickname: string;
  commentCreateTime: string;
  childrenComments?: CommentItem[];
}

export interface PostDetailItem {
  postId: number;
  postTitle?: string;
  postContent: string;
  postVisibility?: boolean;
  nickname: string;
  authorProfileImg?: string | null;
  postCreateTime: string;
  postLikeCnt: number;
  postCommentCnt: number;
  imageUrls?: string[];
  comments?: CommentItem[];
}

const resolveImageOrNull = (raw: unknown): string | null => {
  if (typeof raw !== "string") {
    return null;
  }

  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }

  return normalizeImageList([trimmed])[0] ?? null;
};

const isPostDetailItem = (value: unknown): value is PostDetailItem => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    typeof item.postId === "number" &&
    typeof item.postContent === "string" &&
    typeof item.nickname === "string" &&
    typeof item.postCreateTime === "string" &&
    typeof item.postLikeCnt === "number" &&
    typeof item.postCommentCnt === "number" &&
    (item.imageUrls === undefined || Array.isArray(item.imageUrls)) &&
    (item.comments === undefined || Array.isArray(item.comments))
  );
};

const normalizePost = (res: unknown): PostDetailItem | null => {
  const source =
    typeof res === "object" && res !== null
      ? ((res as { data?: unknown }).data ?? res)
      : res;

  if (typeof source === "object" && source !== null) {
    const item = source as Record<string, unknown>;
    const rawImageList =
      item.imageUrls ?? item.images ?? item.postImages ?? item.postImgUrls;
    const singleImage = item.imageUrl ?? item.postImage ?? item.postImgUrl;
    const rawAuthorProfile =
      item.authorProfileImg ??
      item.userProfileImg ??
      item.profileImg ??
      item.userProfileImage ??
      item.profileImage ??
      item.writerProfileImg;

    const imageUrls =
      normalizeImageList(rawImageList).length > 0
        ? normalizeImageList(rawImageList)
        : typeof singleImage === "string"
          ? normalizeImageList([singleImage])
          : [];

    const normalized: PostDetailItem = {
      postId: Number(item.postId),
      postTitle:
        typeof item.postTitle === "string" ? item.postTitle : undefined,
      postContent: typeof item.postContent === "string" ? item.postContent : "",
      postVisibility:
        typeof item.postVisibility === "boolean"
          ? item.postVisibility
          : undefined,
      nickname: typeof item.nickname === "string" ? item.nickname : "",
      authorProfileImg: resolveImageOrNull(rawAuthorProfile),
      postCreateTime:
        typeof item.postCreateTime === "string" ? item.postCreateTime : "",
      postLikeCnt: typeof item.postLikeCnt === "number" ? item.postLikeCnt : 0,
      postCommentCnt:
        typeof item.postCommentCnt === "number" ? item.postCommentCnt : 0,
      imageUrls,
      comments: Array.isArray(item.comments)
        ? (item.comments as CommentItem[])
        : undefined,
    };

    if (isPostDetailItem(normalized)) {
      return normalized;
    }
  }

  return null;
};

export const usePost = (postId?: number | string) =>
  useQuery({
    queryKey: ["post", String(postId ?? "")],
    queryFn: () => getPost(postId as number | string),
    enabled:
      postId !== undefined &&
      postId !== null &&
      String(postId).trim().length > 0,
    select: normalizePost,
  });

export const usePostComment = (postId: number | string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: { commentContent: string; parentId: number | null }) =>
      postPost(postId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", String(postId)] });
    },
  });
};

export interface PatchPostPayload {
  postVisibility: boolean;
  postTitle: string;
  postContent: string;
  newImages: string[];
}

export const usePatchPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: {
      postId: number | string;
      payload: PatchPostPayload;
    }) => patchPost(variables.postId, variables.payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["post", String(variables.postId)],
      });
      queryClient.invalidateQueries({ queryKey: ["community"] });
    },
  });
};
