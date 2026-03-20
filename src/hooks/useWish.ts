import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { postPostWish } from "../services/home/wish.service";
import { getLikedPostIds, setLikedPostIds } from "../utils/storage";
import type { CommunityItem } from "./useCommunity";
import type { PostDetailItem } from "./usePost";

const POST_LIKED_IDS_QUERY_KEY = ["liked-post-ids"];

const normalizePostId = (postId?: number | string) =>
  String(postId ?? "").trim();

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
