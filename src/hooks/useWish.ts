import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { postCommentWish, postPostWish } from "../services/home/wish.service";
import {
  getLikedCommentIds,
  getLikedPostIds,
  setLikedCommentIds,
  setLikedPostIds,
} from "../utils/storage";
import type { CommunityItem } from "./useCommunity";
import type { PostDetailItem } from "./usePost";

const POST_LIKED_IDS_QUERY_KEY = ["liked-post-ids"];
const COMMENT_LIKED_IDS_QUERY_KEY = ["liked-comment-ids"];

const normalizePostId = (postId?: number | string) =>
  String(postId ?? "").trim();

const normalizeCommentId = (commentId?: number | string) =>
  String(commentId ?? "").trim();

const updatePostCount = (
  post: PostDetailItem | null | undefined,
  targetPostId: string,
  delta: number,
) => {
  if (!post || String(post.postId) !== targetPostId) {
    return post;
  }

  return {
    ...post,
    postLikeCnt: Math.max(0, post.postLikeCnt + delta),
  };
};

const updateCommunityCounts = (
  posts: CommunityItem[] | undefined,
  targetPostId: string,
  delta: number,
) => {
  if (!posts) {
    return posts;
  }

  return posts.map((post) =>
    String(post.postId) === targetPostId
      ? {
          ...post,
          postLikeCnt: Math.max(0, post.postLikeCnt + delta),
        }
      : post,
  );
};

export const useLikedPostIds = () =>
  useQuery({
    queryKey: POST_LIKED_IDS_QUERY_KEY,
    queryFn: getLikedPostIds,
    staleTime: Infinity,
  });

export const useIsPostLiked = (postId?: number | string) => {
  const { data = [] } = useLikedPostIds();
  const normalizedPostId = normalizePostId(postId);

  return normalizedPostId.length > 0 && data.includes(normalizedPostId);
};

export const useLikedCommentIds = () =>
  useQuery({
    queryKey: COMMENT_LIKED_IDS_QUERY_KEY,
    queryFn: getLikedCommentIds,
    staleTime: Infinity,
  });

export const usePostWish = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { likedPostId: number | string }) =>
      postPostWish(variables.likedPostId),
    onMutate: async (variables) => {
      const normalizedPostId = normalizePostId(variables.likedPostId);

      if (!normalizedPostId) {
        return {
          previousLikedPostIds: [],
          previousPost: undefined,
          previousCommunityQueries: [],
        };
      }

      await queryClient.cancelQueries({ queryKey: POST_LIKED_IDS_QUERY_KEY });
      await queryClient.cancelQueries({ queryKey: ["post", normalizedPostId] });
      await queryClient.cancelQueries({ queryKey: ["community"] });

      const previousLikedPostIds =
        queryClient.getQueryData<string[]>(POST_LIKED_IDS_QUERY_KEY) ?? [];
      const wasLiked = previousLikedPostIds.includes(normalizedPostId);
      const nextLikedPostIds = wasLiked
        ? previousLikedPostIds.filter((postId) => postId !== normalizedPostId)
        : [...previousLikedPostIds, normalizedPostId];
      const delta = wasLiked ? -1 : 1;

      queryClient.setQueryData(POST_LIKED_IDS_QUERY_KEY, nextLikedPostIds);
      void setLikedPostIds(nextLikedPostIds);

      const previousPost = queryClient.getQueryData<PostDetailItem | null>([
        "post",
        normalizedPostId,
      ]);
      queryClient.setQueryData<PostDetailItem | null>(
        ["post", normalizedPostId],
        (oldPost) => updatePostCount(oldPost, normalizedPostId, delta) ?? null,
      );

      const previousCommunityQueries = queryClient.getQueriesData<
        CommunityItem[] | undefined
      >({ queryKey: ["community"] });

      previousCommunityQueries.forEach(([queryKey]) => {
        queryClient.setQueryData<CommunityItem[] | undefined>(
          queryKey,
          (oldPosts) =>
            updateCommunityCounts(oldPosts, normalizedPostId, delta),
        );
      });

      return {
        previousLikedPostIds,
        previousPost,
        previousCommunityQueries,
      };
    },
    onError: async (_, variables, context) => {
      const normalizedPostId = normalizePostId(variables.likedPostId);

      if (!context) {
        return;
      }

      queryClient.setQueryData(
        POST_LIKED_IDS_QUERY_KEY,
        context.previousLikedPostIds,
      );
      await setLikedPostIds(context.previousLikedPostIds);

      if (normalizedPostId) {
        queryClient.setQueryData(
          ["post", normalizedPostId],
          context.previousPost,
        );
      }

      context.previousCommunityQueries.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["post", String(variables.likedPostId)],
      });
      queryClient.invalidateQueries({ queryKey: ["community"] });
    },
  });
};

export const useCommentWish = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: {
      likedCommentId: number | string;
      postId?: number | string;
    }) => {
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        console.log("[COMMENT_WISH] mutate", {
          likedCommentId: variables.likedCommentId,
          postId: variables.postId,
        });
      }

      return postCommentWish(variables.likedCommentId);
    },
    onMutate: async (variables) => {
      const normalizedCommentId = normalizeCommentId(variables.likedCommentId);

      if (!normalizedCommentId) {
        return { previousLikedCommentIds: [] };
      }

      await queryClient.cancelQueries({
        queryKey: COMMENT_LIKED_IDS_QUERY_KEY,
      });

      const previousLikedCommentIds =
        queryClient.getQueryData<string[]>(COMMENT_LIKED_IDS_QUERY_KEY) ?? [];
      const wasLiked = previousLikedCommentIds.includes(normalizedCommentId);
      const nextLikedCommentIds = wasLiked
        ? previousLikedCommentIds.filter(
            (commentId) => commentId !== normalizedCommentId,
          )
        : [...previousLikedCommentIds, normalizedCommentId];

      queryClient.setQueryData(
        COMMENT_LIKED_IDS_QUERY_KEY,
        nextLikedCommentIds,
      );
      void setLikedCommentIds(nextLikedCommentIds);

      return { previousLikedCommentIds };
    },
    onSuccess: (_, variables) => {
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        console.log("[COMMENT_WISH] success", {
          likedCommentId: variables.likedCommentId,
          postId: variables.postId,
        });
      }

      // Comment like state is intentionally maintained locally because
      // backend does not provide liked-state GET yet.
    },
    onError: async (error, variables, context) => {
      console.log("[COMMENT_WISH] error", {
        likedCommentId: variables.likedCommentId,
        postId: variables.postId,
        error,
      });

      if (!context) {
        return;
      }

      queryClient.setQueryData(
        COMMENT_LIKED_IDS_QUERY_KEY,
        context.previousLikedCommentIds,
      );
      await setLikedCommentIds(context.previousLikedCommentIds);
    },
  });
};
