"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import PostCard from "@/components/PostCard";
import InteractiveGrid from "@/components/InteractiveGrid";
import { Zap, LayoutDashboard, Info, X, Plus, Camera, Upload, Trash2 } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { usePathname, useRouter } from "next/navigation";
import type { Post } from "@/lib/dataProvider";
import { listFeedFromApi, type FeedSettingsInput } from "@/lib/postApi";
import { readFeedCache } from "@/lib/feedCache";
import ModalShell from "@/components/ModalShell";
import SiteContainer from "@/components/SiteContainer";

const FEED_SETTINGS_STORAGE_KEY = "occ-feed-settings";

const defaultFeedSettings: Required<FeedSettingsInput> = {
  sortBy: "latest",
  showClubPosts: true,
  showGeneralPosts: true,
};

const readStoredFeedSettings = (): Required<FeedSettingsInput> => {
  if (typeof window === "undefined") {
    return defaultFeedSettings;
  }

  try {
    const raw = localStorage.getItem(FEED_SETTINGS_STORAGE_KEY);
    if (!raw) return defaultFeedSettings;
    const parsed = JSON.parse(raw) as FeedSettingsInput;
    return {
      sortBy: parsed.sortBy === "popular" ? "popular" : "latest",
      showClubPosts: parsed.showClubPosts ?? true,
      showGeneralPosts: parsed.showGeneralPosts ?? true,
    };
  } catch {
    return defaultFeedSettings;
  }
};

export default function FeedPage() {
  const { isLoggedIn, addPost, clubs, memberships } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showFeedSettings, setShowFeedSettings] = useState(false);
  const [feedSettings, setFeedSettings] = useState<Required<FeedSettingsInput>>(readStoredFeedSettings);
  const [draftFeedSettings, setDraftFeedSettings] = useState<Required<FeedSettingsInput>>(readStoredFeedSettings);
  const [postForm, setPostForm] = useState({
    content: "",
    clubName: "General",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState("");
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);
  const [postSubmitError, setPostSubmitError] = useState("");
  const [feedPosts, setFeedPosts] = useState<Post[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isApplyingFeedSettings, setIsApplyingFeedSettings] = useState(false);
  const [feedError, setFeedError] = useState("");
  const [feedEmptyMessage, setFeedEmptyMessage] = useState("No activity yet. Be the first to post!");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const joinedClubs = useMemo(
    () =>
      clubs.filter(
        (club) =>
          memberships.includes(club.id) &&
          (club.canPost || club.isJoined || club.isOwner || club.membershipRole === "OWNER"),
      ),
    [clubs, memberships],
  );

  const doesPostMatchFeedSettings = useCallback((clubId?: string | null) => {
    const isClubPost = !!clubId && clubId !== "general";
    if (isClubPost) {
      return feedSettings.showClubPosts;
    }
    return feedSettings.showGeneralPosts;
  }, [feedSettings.showClubPosts, feedSettings.showGeneralPosts]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowCreatePost(false);
      }
    };

    if (showCreatePost) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showCreatePost]);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  useEffect(() => {
    let isActive = true;
    const cachedFeed = readFeedCache(1, 10, feedSettings);
    if (cachedFeed) {
      setFeedPosts(cachedFeed.items);
      setCurrentPage(cachedFeed.page);
      setTotalPages(cachedFeed.totalPages);
    }

    const hydrateFeed = async () => {
      try {
        setFeedError("");
        const feed = await listFeedFromApi(1, 10, feedSettings);
        if (!isActive) return;
        setFeedPosts(feed.items);
        setCurrentPage(feed.page);
        setTotalPages(feed.totalPages);
        setFeedEmptyMessage(
          feedSettings.showClubPosts || feedSettings.showGeneralPosts
            ? "No posts match your current feed settings."
            : "Choose at least one post type to see your feed.",
        );
      } catch {
        if (!isActive) return;
        setFeedError("We couldn't refresh the feed right now.");
      }
    };

    hydrateFeed();

    return () => {
      isActive = false;
    };
  }, [feedSettings]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(FEED_SETTINGS_STORAGE_KEY, JSON.stringify(feedSettings));
  }, [feedSettings]);

  useEffect(() => {
    if (postForm.clubName === "General") {
      return;
    }

    const stillAllowed = joinedClubs.some((club) => club.name === postForm.clubName);
    if (!stillAllowed) {
      setPostForm((prev) => ({ ...prev, clubName: "General" }));
    }
  }, [joinedClubs, postForm.clubName]);

  const handleCreatePost = useCallback(() => {
    if (!isLoggedIn) {
      router.push(`/login?next=${encodeURIComponent(pathname ?? "/feeds")}`);
      return;
    }
    setShowCreatePost(true);
  }, [isLoggedIn, pathname, router]);

  const handleOpenFeedSettings = useCallback(() => {
    setDraftFeedSettings(feedSettings);
    setShowFeedSettings(true);
  }, [feedSettings]);

  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || currentPage >= totalPages) return;

    setIsLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const feed = await listFeedFromApi(nextPage, 10, feedSettings);
      setFeedPosts((prev) => [...prev, ...feed.items]);
      setCurrentPage(feed.page);
      setTotalPages(feed.totalPages);
    } finally {
      setIsLoadingMore(false);
    }
  }, [currentPage, feedSettings, isLoadingMore, totalPages]);

  const handleDeletePostFromFeed = useCallback((postId: string) => {
    setFeedPosts((prev) => prev.filter((post) => post.id !== postId));
  }, []);

  const handleCloseFeedSettings = useCallback(() => {
    setShowFeedSettings(false);
  }, []);

  const handleApplyFeedSettings = useCallback(async () => {
    setIsApplyingFeedSettings(true);
    try {
      setFeedSettings(draftFeedSettings);
      setCurrentPage(1);
      setShowFeedSettings(false);
    } finally {
      setIsApplyingFeedSettings(false);
    }
  }, [draftFeedSettings]);

  const handleFeedFilterToggle = useCallback(
    (key: "showClubPosts" | "showGeneralPosts", value: boolean) => {
      const nextSettings = { ...draftFeedSettings, [key]: value };
      if (!nextSettings.showClubPosts && !nextSettings.showGeneralPosts) {
        setDraftFeedSettings({
          ...nextSettings,
          [key === "showClubPosts" ? "showGeneralPosts" : "showClubPosts"]: true,
        });
        return;
      }
      setDraftFeedSettings(nextSettings);
    },
    [draftFeedSettings],
  );

  const handleCloseModal = useCallback(() => {
    setShowCreatePost(false);
    setPostForm({
      content: "",
      clubName: "General",
    });
    setSelectedImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setImageError("");
    setPostSubmitError("");
    setIsSubmittingPost(false);
  }, [imagePreview]);

  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setImageError("Image size must be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setImageError("Please select a valid image file");
      return;
    }

    setImageError("");
    setSelectedImage(file);

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  }, [imagePreview]);

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleRemoveImage = useCallback(() => {
    setSelectedImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setImageError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [imagePreview]);

  const handleSubmitPost = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmittingPost || !postForm.content.trim()) {
      return;
    }

    const selectedClub = joinedClubs.find((club) => club.name === postForm.clubName);
    setIsSubmittingPost(true);
    setPostSubmitError("");

    try {
      const created = await addPost({
        content: postForm.content,
        clubId: selectedClub?.id || null,
        imageFile: selectedImage,
      });

      if (!created) {
        setPostSubmitError("We couldn't create your post right now.");
        return;
      }

      if (doesPostMatchFeedSettings(created.clubId)) {
        setFeedPosts((prev) => {
          const nextPosts = [created, ...prev];
          if (feedSettings.sortBy === "popular") {
            return [...nextPosts].sort((a, b) => b.likes - a.likes);
          }
          return nextPosts;
        });
      }

      handleCloseModal();
    } catch {
      setPostSubmitError("We couldn't create your post right now.");
    } finally {
      setIsSubmittingPost(false);
    }
  }, [addPost, doesPostMatchFeedSettings, feedSettings.sortBy, handleCloseModal, isSubmittingPost, joinedClubs, postForm, selectedImage]);

  return (
    <SiteContainer size="narrow" className="space-y-12 pb-24 pt-12">
      <div className="group relative flex flex-col items-start gap-6 overflow-hidden border-8 border-black bg-black p-8 text-white shadow-[12px_12px_0_0_#1d2cf3] md:flex-row md:items-end md:justify-between md:p-12">
        <InteractiveGrid variant="page" scope="container" />
        <div className="pointer-events-none absolute inset-0 bg-black/65"></div>
        <div className="pointer-events-none absolute -right-10 -top-10 select-none text-[200px] font-black leading-none text-white opacity-10 transition-transform duration-700 group-hover:rotate-0 -rotate-12">
          *
        </div>

        <div className="relative z-10 w-full flex-1 space-y-4">
          <div className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-brutal-blue">
            <Zap className="w-4 h-4 fill-brutal-blue" /> Live Activity
          </div>
          <h1 className="text-6xl font-black uppercase leading-[0.8] tracking-tighter italic md:text-8xl lg:text-9xl">Feeds</h1>
          <p className="mt-8 max-w-md border-l-4 border-brutal-blue pl-4 text-xl font-bold">
            The heartbeat of the OCC network for club posts, announcements, updates, and student activity.
          </p>
        </div>

        <div className="relative z-10 flex w-full flex-col gap-4 sm:w-auto">
          <button
            onClick={handleCreatePost}
            className="flex items-center gap-2 border-2 border-black bg-white px-8 py-4 text-lg font-black uppercase text-black shadow-[4px_4px_0_0_#fff] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
          >
            <Plus className="w-5 h-5" />
            New Post
          </button>
          <button
            onClick={handleOpenFeedSettings}
            className="flex items-center justify-center gap-2 border-2 border-white/20 bg-transparent px-8 py-4 text-xs font-black uppercase text-white transition-all hover:border-white"
          >
            <Info className="w-4 h-4" /> Feed Settings
          </button>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-white/70">
            {feedSettings.sortBy === "popular" ? "Popular first" : "Latest first"} {"\u00B7"} {feedSettings.showClubPosts ? "Club" : ""}{feedSettings.showClubPosts && feedSettings.showGeneralPosts ? " + " : ""}{feedSettings.showGeneralPosts ? "General" : ""}
          </p>
        </div>
      </div>

      <div className="mb-20 space-y-12">
        {feedError ? (
          <div className="border-4 border-black bg-white p-8 text-center shadow-[8px_8px_0_0_#000]">
            <p className="font-black uppercase text-red-600">{feedError}</p>
          </div>
        ) : null}
        {feedPosts.length === 0 ? (
          <div className="border-4 border-black bg-white p-20 text-center shadow-[8px_8px_0_0_#000]">
            <h2 className="mb-4 text-4xl font-black uppercase">Radio Silence</h2>
            <p className="font-bold text-gray-500">{feedEmptyMessage}</p>
          </div>
        ) : (
          feedPosts.map((post) => (
            <PostCard key={post.id} post={post} onDeleteSuccess={handleDeletePostFromFeed} />
          ))
        )}
      </div>

      <div className="flex justify-center pt-8">
        <button
          onClick={handleLoadMore}
          disabled={isLoadingMore || currentPage >= totalPages}
          className="group flex items-center gap-2 text-2xl font-black uppercase transition-all hover:text-brutal-blue"
        >
          {currentPage >= totalPages ? "All posts loaded" : isLoadingMore ? "Loading..." : "Load more posts"} <LayoutDashboard className="w-8 h-8 transition-transform group-hover:rotate-12" />
        </button>
      </div>

      {showCreatePost && (
        <ModalShell
          className="max-h-[calc(100vh-3rem)] w-full max-w-2xl overflow-y-auto border-8 border-black bg-white shadow-[16px_16px_0_0_#1d2cf3]"
          onClose={handleCloseModal}
        >
          <div>
            <div className="p-8">
              <div className="mb-8 flex items-center justify-between border-b-4 border-black pb-4">
                <h2 className="text-4xl font-black uppercase tracking-tighter">Create Post</h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 transition-colors hover:bg-brutal-gray"
                  aria-label="Close modal"
                >
                  <X className="w-8 h-8" />
                </button>
              </div>

              <form onSubmit={handleSubmitPost} className="space-y-6">
                <div>
                  <label className="mb-2 block font-black uppercase text-sm tracking-widest text-gray-600">
                    Club
                  </label>
                  <select
                    value={postForm.clubName}
                    onChange={(e) => setPostForm({ ...postForm, clubName: e.target.value })}
                    className="occ-select text-lg"
                  >
                    <option value="General">General</option>
                    {joinedClubs.map((club) => (
                      <option key={club.id} value={club.name}>
                        {club.name}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-sm font-bold text-gray-500">
                    {joinedClubs.length > 0
                      ? "You can post to General or to clubs you have already joined."
                      : "You have not joined any clubs yet, so posts can only be published to General."}
                  </p>
                </div>

                <div>
                  <label className="mb-2 block font-black uppercase text-sm tracking-widest text-gray-600">
                    What&apos;s happening?
                  </label>
                  <textarea
                    value={postForm.content}
                    onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                    rows={4}
                    required
                    placeholder="Share something with your clubs..."
                    className="occ-textarea resize-none text-lg"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-black uppercase text-sm tracking-widest text-gray-600">
                    Image (Optional)
                  </label>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    capture="environment"
                  />

                  {imagePreview ? (
                    <div className="relative mb-4">
                      <div className="aspect-[4/3] overflow-hidden border-4 border-black bg-[#eef1f7] shadow-[4px_4px_0_0_#000]">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute right-2 top-2 border-2 border-black bg-red-500 p-2 text-white shadow-[2px_2px_0_0_#000] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
                        aria-label="Remove image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={handleUploadClick}
                        className="flex flex-1 items-center justify-center gap-2 border-4 border-black bg-white px-6 py-3 text-sm font-black uppercase text-black shadow-[4px_4px_0_0_#000] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                      >
                        <Upload className="w-4 h-4" />
                        Upload Image
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (fileInputRef.current) {
                            fileInputRef.current.setAttribute("capture", "environment");
                            fileInputRef.current.click();
                          }
                        }}
                        className="flex flex-1 items-center justify-center gap-2 border-4 border-black bg-white px-6 py-3 text-sm font-black uppercase text-black shadow-[4px_4px_0_0_#000] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                      >
                        <Camera className="w-4 h-4" />
                        Take Photo
                      </button>
                    </div>
                  )}

                  {imageError ? (
                    <p className="mt-2 border-l-4 border-red-500 pl-2 text-sm font-bold text-red-500">
                      {imageError}
                    </p>
                  ) : null}
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmittingPost}
                    className="flex-1 border-4 border-black bg-black px-8 py-4 text-lg font-black uppercase text-white shadow-[6px_6px_0_0_#1d2cf3] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                  >
                    {isSubmittingPost ? "Posting..." : "Post"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 border-4 border-black bg-white px-8 py-4 text-lg font-black uppercase text-black shadow-[6px_6px_0_0_#000] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
                  >
                    Cancel
                  </button>
                </div>
                {postSubmitError ? (
                  <p className="border-l-4 border-red-600 pl-3 text-sm font-bold text-red-600">
                    {postSubmitError}
                  </p>
                ) : null}
              </form>
            </div>
          </div>
        </ModalShell>
      )}

      {showFeedSettings && (
        <ModalShell
          className="max-h-[calc(100vh-3rem)] w-full max-w-lg overflow-y-auto border-8 border-black bg-white shadow-[16px_16px_0_0_#1d2cf3]"
          onClose={handleCloseFeedSettings}
        >
          <div>
            <div className="p-8">
              <div className="mb-8 flex items-center justify-between border-b-4 border-black pb-4">
                <h2 className="text-4xl font-black uppercase tracking-tighter">Feed Settings</h2>
                <button
                  onClick={handleCloseFeedSettings}
                  className="p-2 transition-colors hover:bg-brutal-gray"
                  aria-label="Close settings"
                >
                  <X className="w-8 h-8" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="mb-4 block font-black uppercase text-sm tracking-widest text-gray-600">
                    Sort Posts By
                  </label>
                  <div className="space-y-2">
                    <label className="flex cursor-pointer items-center gap-3">
                      <input
                        type="radio"
                        name="sortBy"
                        value="latest"
                        checked={draftFeedSettings.sortBy === "latest"}
                        onChange={(e) => setDraftFeedSettings({ ...draftFeedSettings, sortBy: e.target.value as "latest" | "popular" })}
                        className="occ-check"
                      />
                      <span className="text-lg font-bold">Latest Posts</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-3">
                      <input
                        type="radio"
                        name="sortBy"
                        value="popular"
                        checked={draftFeedSettings.sortBy === "popular"}
                        onChange={(e) => setDraftFeedSettings({ ...draftFeedSettings, sortBy: e.target.value as "latest" | "popular" })}
                        className="occ-check"
                      />
                      <span className="text-lg font-bold">Popular Posts</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="mb-4 block font-black uppercase text-sm tracking-widest text-gray-600">
                    Show Posts From
                  </label>
                  <div className="space-y-2">
                    <label className="flex cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        checked={draftFeedSettings.showClubPosts}
                        onChange={(e) => handleFeedFilterToggle("showClubPosts", e.target.checked)}
                        className="occ-check"
                      />
                      <span className="text-lg font-bold">Club Posts</span>
                    </label>
                    <label className="flex cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        checked={draftFeedSettings.showGeneralPosts}
                        onChange={(e) => handleFeedFilterToggle("showGeneralPosts", e.target.checked)}
                        className="occ-check"
                      />
                      <span className="text-lg font-bold">General Posts</span>
                    </label>
                  </div>
                  <p className="mt-3 text-sm font-bold text-gray-500">
                    At least one post type stays enabled so your feed never lands in a dead state.
                  </p>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleApplyFeedSettings}
                    disabled={isApplyingFeedSettings}
                    className="w-full border-4 border-black bg-black px-8 py-4 text-lg font-black uppercase text-white shadow-[6px_6px_0_0_#1d2cf3] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none disabled:opacity-60 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[6px_6px_0_0_#1d2cf3]"
                  >
                    {isApplyingFeedSettings ? "Applying..." : "Apply Settings"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </ModalShell>
      )}
    </SiteContainer>
  );
}
