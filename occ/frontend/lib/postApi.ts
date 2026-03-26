import api from "@/lib/api";
import type { Post } from "@/lib/dataProvider";
import { clearRequestCache, withRequestCache } from "@/lib/requestCache";
import { resolveAssetUrl } from "@/lib/assetUrl";
import { clearFeedCache, writeFeedCache } from "@/lib/feedCache";

type ApiPost = {
  id: string;
  content: string;
  imageUrl?: string | null;
  createdAt?: string;
  likesCount?: number;
  commentsCount?: number;
  isLikedByCurrentUser?: boolean;
  author?: {
    profile?: {
      displayName?: string | null;
    } | null;
  } | null;
  club?: {
    id: string;
    name?: string | null;
    logoUrl?: string | null;
  } | null;
};

type FeedResponse = {
  data?: {
    items?: ApiPost[];
    page?: number;
    total?: number;
    totalPages?: number;
  };
};

type SinglePostResponse = {
  data?: {
    post?: ApiPost | null;
  };
};

type ApiComment = {
  id: string;
  content: string;
  author?: {
    profile?: {
      displayName?: string | null;
    } | null;
  } | null;
};

export type FeedPageResult = {
  items: Post[];
  page: number;
  total: number;
  totalPages: number;
};

export type FeedSettingsInput = {
  sortBy?: "latest" | "popular";
  showClubPosts?: boolean;
  showGeneralPosts?: boolean;
};

export type PostUpsertInput = {
  content: string;
  clubId?: string | null;
  imageFile?: File | null;
  removeImage?: boolean;
};

const relativeTime = (value?: string) => {
  if (!value) return "Just now";
  const createdAt = new Date(value);
  const diffMs = Date.now() - createdAt.getTime();

  if (!Number.isFinite(diffMs) || diffMs < 0) return "Just now";

  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export const toPostRecord = (post: ApiPost): Post => ({
  id: post.id,
  clubId: post.club?.id || "general",
  clubName: post.club?.name?.trim() || "General",
  clubLogo: resolveAssetUrl(post.club?.logoUrl, "/globe.svg") || "/globe.svg",
  author: post.author?.profile?.displayName?.trim() || "Anonymous",
  content: post.content,
  image: resolveAssetUrl(post.imageUrl) || undefined,
  timestamp: relativeTime(post.createdAt),
  likes: post.likesCount ?? 0,
  comments: [],
  commentsCount: post.commentsCount ?? 0,
  isLiked: !!post.isLikedByCurrentUser,
});

function buildPostFormData(input: PostUpsertInput) {
  const formData = new FormData();
  formData.append("content", input.content.trim());

  if (input.clubId && input.clubId !== "general") {
    formData.append("clubId", input.clubId);
  }

  if (input.imageFile) {
    formData.append("image", input.imageFile);
  }

  if (input.removeImage) {
    formData.append("removeImage", "true");
  }

  return formData;
}

export async function listFeedFromApi(
  page = 1,
  limit = 10,
  settings: FeedSettingsInput = {},
): Promise<FeedPageResult> {
  const params = {
    page,
    limit,
    sort: settings.sortBy || "latest",
    includeClubPosts: settings.showClubPosts ?? true,
    includeGeneralPosts: settings.showGeneralPosts ?? true,
  };

  return withRequestCache(
    `feed:${JSON.stringify(params)}`,
    async () => {
      const response = await api.get<FeedResponse>("/feed", { params });
      const data = response.data?.data;
      const items = data?.items?.map(toPostRecord) ?? [];

      return {
        items,
        page: data?.page ?? page,
        total: data?.total ?? items.length,
        totalPages: data?.totalPages ?? 1,
      };
    },
    15_000,
  ).then((result) => {
    writeFeedCache(page, limit, settings, result);
    return result;
  });
}

export async function getPostByIdFromApi(postId: string) {
  const response = await api.get<SinglePostResponse>(`/posts/${postId}`);
  const post = response.data?.data?.post;
  return post ? toPostRecord(post) : null;
}

export async function createPostOnApi(input: PostUpsertInput) {
  const response = await api.post<SinglePostResponse>("/posts", buildPostFormData(input));
  const post = response.data?.data?.post;
  if (!post) {
    throw new Error("Post response did not include a post record.");
  }
  clearRequestCache("feed:");
  clearFeedCache();
  return toPostRecord(post);
}

export async function updatePostOnApi(postId: string, input: PostUpsertInput) {
  const response = await api.patch<SinglePostResponse>(`/posts/${postId}`, buildPostFormData(input));
  const post = response.data?.data?.post;
  if (!post) {
    throw new Error("Post response did not include a post record.");
  }
  clearRequestCache("feed:");
  clearFeedCache();
  return toPostRecord(post);
}

export async function deletePostOnApi(postId: string) {
  await api.delete(`/posts/${postId}`);
  clearRequestCache("feed:");
  clearFeedCache();
}

export async function likePostOnApi(postId: string) {
  await api.post(`/posts/${postId}/like`);
  clearRequestCache("feed:");
  clearFeedCache();
}

export async function unlikePostOnApi(postId: string) {
  await api.delete(`/posts/${postId}/like`);
  clearRequestCache("feed:");
  clearFeedCache();
}

export async function commentOnPostOnApi(postId: string, content: string) {
  const response = await api.post(`/posts/${postId}/comments`, { content });
  clearRequestCache("feed:");
  clearFeedCache();
  return response.data?.data?.comment;
}

export async function listCommentsOnApi(postId: string, page = 1) {
  const response = await api.get(`/posts/${postId}/comments`, { params: { page, limit: 100 } });
  return response.data?.data?.items?.map((apiComment: ApiComment) => ({
    id: apiComment.id,
    author: apiComment.author?.profile?.displayName || "Anonymous",
    content: apiComment.content
  })) || [];
}
