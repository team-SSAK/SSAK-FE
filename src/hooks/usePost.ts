import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPost, postPost } from "../services/home/post.service";

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
  postCreateTime: string;
  postLikeCnt: number;
  postCommentCnt: number;
  imageUrls?: string[];
  comments?: CommentItem[];
}

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
  if (isPostDetailItem(res)) {
    return res;
  }

  if (typeof res === "object" && res !== null) {
    const wrapped = res as { data?: unknown };

    if (isPostDetailItem(wrapped.data)) {
      return wrapped.data;
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
