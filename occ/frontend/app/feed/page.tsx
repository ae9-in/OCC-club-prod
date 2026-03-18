"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { type Post } from "@/lib/dataProvider";
import PostCard from "@/components/PostCard";
import InteractiveGrid from "@/components/InteractiveGrid";
import { Zap, LayoutDashboard, Info, X, Plus, Camera, Upload, Trash2 } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { usePathname, useRouter } from "next/navigation";

export default function FeedPage() {
  const { user, isLoggedIn, posts, addPost, clubs } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showFeedSettings, setShowFeedSettings] = useState(false);
  const [feedSettings, setFeedSettings] = useState({
    sortBy: "latest" as "latest" | "popular",
    showClubPosts: true,
    showGeneralPosts: true
  });
  const [postForm, setPostForm] = useState({
    content: "",
    clubName: "General"
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowCreatePost(false);
      }
    };

    if (showCreatePost) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [showCreatePost]);

  // Clean up image preview URL when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleCreatePost = useCallback(() => {
    if (!isLoggedIn) {
      router.push(`/login?next=${encodeURIComponent(pathname ?? "/feed")}`);
      return;
    }
    setShowCreatePost(true);
  }, [isLoggedIn, pathname, router]);

  const handleOpenFeedSettings = useCallback(() => {
    setShowFeedSettings(true);
  }, []);

  // TODO: Replace with API call to load more posts
  const handleLoadMore = useCallback(() => {}, []);

  const handleCloseFeedSettings = useCallback(() => {
    setShowFeedSettings(false);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowCreatePost(false);
    setPostForm({
      content: "",
      clubName: "General"
    });
    setSelectedImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setImageError("");
  }, [imagePreview]);

  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setImageError("Image size must be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setImageError("Please select a valid image file");
      return;
    }

    setImageError("");
    setSelectedImage(file);
    
    // Create preview URL
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

  // TODO: Replace with API call to create post
  const createPost = useCallback((postData: typeof postForm, image: File | null) => {
    const selectedClub = clubs.find((club) => club.name === postData.clubName);
    const newPost: Post = {
      id: Date.now().toString(),
      clubId: selectedClub?.id || "general",
      clubName: postData.clubName,
      clubLogo: selectedClub?.logo || "/globe.svg",
      author: user?.name || "Anonymous",
      content: postData.content,
      image: image ? URL.createObjectURL(image) : undefined,
      timestamp: "Just now",
      likes: 0,
      comments: []
    };
    addPost(newPost);
  }, [user, addPost, clubs]);

  const handleSubmitPost = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (!postForm.content.trim()) {
      return;
    }

    createPost(postForm, selectedImage);
    handleCloseModal();
  }, [postForm, selectedImage, createPost, handleCloseModal]);

  const handleModalBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCloseModal();
    }
  }, [handleCloseModal]);

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-24 pt-12 px-4 md:px-0">
      {/* Feed Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-black text-white p-8 md:p-12 border-8 border-black shadow-[12px_12px_0_0_#1d2cf3] relative overflow-hidden group">
        <InteractiveGrid variant="page" scope="container" />
        <div className="absolute inset-0 bg-black/65 pointer-events-none"></div>
        <div className="absolute -right-10 -top-10 text-[200px] text-white opacity-10 font-black leading-none select-none pointer-events-none -rotate-12 group-hover:rotate-0 transition-transform duration-700">*</div>
        
        <div className="relative z-10 space-y-4 w-full flex-1">
          <div className="flex items-center gap-2 text-brutal-blue font-black uppercase text-xs tracking-[0.2em] mb-4">
            <Zap className="w-4 h-4 fill-brutal-blue" /> Live Activity
          </div>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase leading-[0.8] tracking-tighter italic">Daily <br/>Feed</h1>
          <p className="text-xl font-bold border-l-4 border-brutal-blue pl-4 mt-8 max-w-md">The heartbeat of the campus network. Stay informed, stay connected.</p>
        </div>
        
        <div className="relative z-10 w-full sm:w-auto flex flex-col gap-4">
           <button 
             onClick={handleCreatePost}
             className="bg-white text-black px-8 py-4 font-black uppercase text-lg border-2 border-black shadow-[4px_4px_0_0_#fff] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center gap-2"
           >
             <Plus className="w-5 h-5" />
             New Post
           </button>
           <button 
             onClick={handleOpenFeedSettings}
             className="bg-transparent text-white px-8 py-4 font-black uppercase text-xs border-2 border-white/20 hover:border-white transition-all flex items-center justify-center gap-2">
             <Info className="w-4 h-4"/> Feed Settings
           </button>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-12 mb-20">
        {posts.length === 0 ? (
          <div className="bg-white border-4 border-black p-20 text-center shadow-[8px_8px_0_0_#000]">
            <h2 className="text-4xl font-black uppercase mb-4">Radio Silence</h2>
            <p className="font-bold text-gray-500">No activity yet. Be the first to post!</p>
          </div>
        ) : (
          posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>

      {/* Load More */}
      <div className="flex justify-center pt-8">
        <button 
          onClick={handleLoadMore}
          className="group flex items-center gap-2 font-black uppercase text-2xl hover:text-brutal-blue transition-all"
        >
          Load more posts <LayoutDashboard className="w-8 h-8 group-hover:rotate-12 transition-transform" />
        </button>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={handleModalBackdropClick}
        >
          <div className="bg-white border-8 border-black shadow-[16px_16px_0_0_#1d2cf3] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8 border-b-4 border-black pb-4">
                <h2 className="text-4xl font-black uppercase tracking-tighter">Create Post</h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-brutal-gray transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-8 h-8" />
                </button>
              </div>

              <form onSubmit={handleSubmitPost} className="space-y-6">
                <div>
                  <label className="font-black uppercase text-sm text-gray-600 tracking-widest mb-2 block">
                    Club
                  </label>
                  <select
                    value={postForm.clubName}
                    onChange={(e) => setPostForm({ ...postForm, clubName: e.target.value })}
                    className="w-full border-4 border-black p-4 font-bold text-lg focus:outline-none focus:shadow-[4px_4px_0_0_#1d2cf3]"
                  >
                    <option value="General">General</option>
                    {clubs.map((club) => (
                      <option key={club.id} value={club.name}>
                        {club.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-black uppercase text-sm text-gray-600 tracking-widest mb-2 block">
                    What's happening?
                  </label>
                  <textarea
                    value={postForm.content}
                    onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                    rows={4}
                    required
                    placeholder="Share something with the community..."
                    className="w-full border-4 border-black p-4 font-bold text-lg focus:outline-none focus:shadow-[4px_4px_0_0_#1d2cf3] resize-none"
                  />
                </div>

                <div>
                  <label className="font-black uppercase text-sm text-gray-600 tracking-widest mb-2 block">
                    Image (Optional)
                  </label>
                  
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    capture="environment"
                  />
                  
                  {/* Image preview */}
                  {imagePreview && (
                    <div className="mb-4 relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full max-h-64 object-cover border-4 border-black"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 border-2 border-black shadow-[2px_2px_0_0_#000] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                        aria-label="Remove image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  
                  {/* Upload buttons */}
                  {!imagePreview && (
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={handleUploadClick}
                        className="flex-1 bg-white text-black px-6 py-3 font-black uppercase text-sm border-4 border-black shadow-[4px_4px_0_0_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Upload Image
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (fileInputRef.current) {
                            fileInputRef.current.setAttribute('capture', 'environment');
                            fileInputRef.current.click();
                          }
                        }}
                        className="flex-1 bg-white text-black px-6 py-3 font-black uppercase text-sm border-4 border-black shadow-[4px_4px_0_0_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-2"
                      >
                        <Camera className="w-4 h-4" />
                        Take Photo
                      </button>
                    </div>
                  )}
                  
                  {/* Error message */}
                  {imageError && (
                    <p className="text-red-500 font-bold text-sm mt-2 border-l-4 border-red-500 pl-2">
                      {imageError}
                    </p>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-black text-white px-8 py-4 font-black uppercase text-lg border-4 border-black shadow-[6px_6px_0_0_#1d2cf3] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                  >
                    Post
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 bg-white text-black px-8 py-4 font-black uppercase text-lg border-4 border-black shadow-[6px_6px_0_0_#000] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {/* Feed Settings Modal */}
      {showFeedSettings && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && handleCloseFeedSettings()}
        >
          <div className="bg-white border-8 border-black shadow-[16px_16px_0_0_#1d2cf3] max-w-lg w-full">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8 border-b-4 border-black pb-4">
                <h2 className="text-4xl font-black uppercase tracking-tighter">Feed Settings</h2>
                <button
                  onClick={handleCloseFeedSettings}
                  className="p-2 hover:bg-brutal-gray transition-colors"
                  aria-label="Close settings"
                >
                  <X className="w-8 h-8" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="font-black uppercase text-sm text-gray-600 tracking-widest mb-4 block">
                    Sort Posts By
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="sortBy"
                        value="latest"
                        checked={feedSettings.sortBy === "latest"}
                        onChange={(e) => setFeedSettings({ ...feedSettings, sortBy: e.target.value as "latest" | "popular" })}
                        className="w-5 h-5"
                      />
                      <span className="font-bold text-lg">Latest Posts</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="sortBy"
                        value="popular"
                        checked={feedSettings.sortBy === "popular"}
                        onChange={(e) => setFeedSettings({ ...feedSettings, sortBy: e.target.value as "latest" | "popular" })}
                        className="w-5 h-5"
                      />
                      <span className="font-bold text-lg">Popular Posts</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="font-black uppercase text-sm text-gray-600 tracking-widest mb-4 block">
                    Show Posts From
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={feedSettings.showClubPosts}
                        onChange={(e) => setFeedSettings({ ...feedSettings, showClubPosts: e.target.checked })}
                        className="w-5 h-5"
                      />
                      <span className="font-bold text-lg">Club Posts</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={feedSettings.showGeneralPosts}
                        onChange={(e) => setFeedSettings({ ...feedSettings, showGeneralPosts: e.target.checked })}
                        className="w-5 h-5"
                      />
                      <span className="font-bold text-lg">General Posts</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleCloseFeedSettings}
                    className="w-full bg-black text-white px-8 py-4 font-black uppercase text-lg border-4 border-black shadow-[6px_6px_0_0_#1d2cf3] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                  >
                    Apply Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
