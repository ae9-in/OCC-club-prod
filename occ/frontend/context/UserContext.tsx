"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { type ClubMembership, type Post } from "@/lib/dataProvider";
import { mockPosts } from "@/lib/mockData/posts";
import { ClubRecord, mockClubs } from "@/lib/mockData/clubs";

interface User {
  name: string;
  university: string;
  email: string;
  profilePicture?: string;
  phoneNumber?: string;
  hobbies?: string;
}

interface UserContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isLoggedIn: boolean;
  posts: Post[];
  clubs: ClubRecord[];
  memberships: string[];
  addPost: (post: Post) => void;
  deletePost: (postId: string) => void;
  updatePost: (updatedPost: Post) => void;
  updatePosts: (posts: Post[]) => void;
  createClub: (clubData: {
    name: string;
    description: string;
    category: string;
    university?: string;
    location?: string;
    logoPreview?: string;
  }) => string | null;
  joinClub: (clubId: string) => void;
  leaveClub: (clubId: string) => void;
  isClubJoined: (clubId: string) => boolean;
  getMembershipItems: () => ClubMembership[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const normalizeAssetSrc = (value?: string | null, fallback?: string) => {
  const trimmed = typeof value === "string" ? value.trim() : "";
  if (trimmed) return trimmed;
  return fallback;
};

const normalizeUserRecord = (value: User): User => ({
  ...value,
  profilePicture: normalizeAssetSrc(value.profilePicture),
});

const normalizePostRecord = (value: Post): Post => ({
  ...value,
  clubLogo: normalizeAssetSrc(value.clubLogo, "/globe.svg") || "/globe.svg",
  image: normalizeAssetSrc(value.image),
});

const normalizeClubRecord = (value: ClubRecord): ClubRecord => ({
  ...value,
  logo: normalizeAssetSrc(value.logo, "/globe.svg") || "/globe.svg",
  bannerImage: normalizeAssetSrc(value.bannerImage, "/window.svg") || "/window.svg",
  profileImage: normalizeAssetSrc(value.profileImage, normalizeAssetSrc(value.logo, "/globe.svg")) || "/globe.svg",
  members: value.members.map((member) => ({
    ...member,
    avatar: normalizeAssetSrc(member.avatar, "/globe.svg") || "/globe.svg",
  })),
  gallery: value.gallery.map((item) => ({
    ...item,
    image: normalizeAssetSrc(item.image, "/window.svg") || "/window.svg",
  })),
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>(() => mockPosts.map(normalizePostRecord));
  const [clubs, setClubs] = useState<ClubRecord[]>(() => mockClubs.map(normalizeClubRecord));
  const [memberships, setMemberships] = useState<string[]>([]);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("occ-user");
    const savedMemberships = localStorage.getItem("occ-memberships");
    const savedClubs = localStorage.getItem("occ-clubs");
    const savedPosts = localStorage.getItem("occ-posts");

    if (savedUser) {
      try {
        setUser(normalizeUserRecord(JSON.parse(savedUser)));
      } catch {
        localStorage.removeItem("occ-user");
      }
    }

    if (savedMemberships) {
      try {
        setMemberships(JSON.parse(savedMemberships));
      } catch {
        localStorage.removeItem("occ-memberships");
      }
    }

    if (savedClubs) {
      try {
        setClubs(JSON.parse(savedClubs).map(normalizeClubRecord));
      } catch {
        localStorage.removeItem("occ-clubs");
      }
    }

    if (savedPosts) {
      try {
        setPosts(JSON.parse(savedPosts).map(normalizePostRecord));
      } catch {
        localStorage.removeItem("occ-posts");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("occ-clubs", JSON.stringify(clubs));
  }, [clubs]);

  useEffect(() => {
    localStorage.setItem("occ-posts", JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem("occ-memberships", JSON.stringify(memberships));
  }, [memberships]);

  // TODO: Replace with real auth API call
  const login = (userData: User) => {
    const nextUser = normalizeUserRecord(userData);
    setUser(nextUser);
    localStorage.setItem("occ-user", JSON.stringify(nextUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("occ-user");
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = normalizeUserRecord({ ...user, ...userData });
      setUser(updatedUser);
      localStorage.setItem("occ-user", JSON.stringify(updatedUser));
    }
  };

  // TODO: Replace with API call to create post
  const addPost = (post: Post) => {
    setPosts(prev => [normalizePostRecord(post), ...prev]);
  };

  // TODO: Replace with API call to delete post
  const deletePost = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
  };

  // TODO: Replace with API call to update post
  const updatePost = (updatedPost: Post) => {
    setPosts(prev => prev.map(p => p.id === updatedPost.id ? normalizePostRecord(updatedPost) : p));
  };

  const updatePosts = (newPosts: Post[]) => {
    setPosts(newPosts.map(normalizePostRecord));
  };

  const createClub = (clubData: {
    name: string;
    description: string;
    category: string;
    university?: string;
    location?: string;
    logoPreview?: string;
  }) => {
    if (!user) return null;

    const clubId = `club-${Date.now()}`;
    const logoPreview = clubData.logoPreview || "/globe.svg";
    const newClub: ClubRecord = {
      id: clubId,
      name: clubData.name.trim(),
      description: clubData.description.trim(),
      tagline: `${clubData.name.trim()} starts here.`,
      fullDescription: clubData.description.trim(),
      logo: logoPreview,
      bannerImage: "/window.svg",
      profileImage: logoPreview,
      category: clubData.category,
      location: clubData.location?.trim() || "Campus Hub",
      university: clubData.university?.trim() || user.university || "Independent",
      membersCount: 1,
      eventsCount: 0,
      members: [
        {
          id: `member-${Date.now()}`,
          name: user.name,
          role: "Founder",
          avatar: user.profilePicture || "/globe.svg",
        },
      ],
      events: [],
      gallery: [],
    };

    setClubs(prev => [normalizeClubRecord(newClub), ...prev]);
    setMemberships(prev => (prev.includes(clubId) ? prev : [...prev, clubId]));
    return clubId;
  };

  const joinClub = (clubId: string) => {
    if (!user) return;

    setMemberships(prev => (prev.includes(clubId) ? prev : [...prev, clubId]));
    setClubs(prev =>
      prev.map(club => {
        if (club.id !== clubId) return club;
        if (club.members.some(member => member.name === user.name)) {
          return club;
        }

        return normalizeClubRecord({
          ...club,
          membersCount: club.membersCount + 1,
          members: [
            ...club.members,
            {
              id: `member-${clubId}-${Date.now()}`,
              name: user.name,
              role: "Member",
              avatar: user.profilePicture || "/globe.svg",
            },
          ],
        });
      }),
    );
  };

  const leaveClub = (clubId: string) => {
    if (!user) return;

    setMemberships(prev => prev.filter(id => id !== clubId));
    setClubs(prev =>
      prev.map(club => {
        if (club.id !== clubId) return club;
        const nextMembers = club.members.filter(member => member.name !== user.name);

        return normalizeClubRecord({
          ...club,
          membersCount: Math.max(0, nextMembers.length),
          members: nextMembers,
        });
      }),
    );
  };

  const isClubJoined = (clubId: string) => memberships.includes(clubId);

  const getMembershipItems = () =>
    clubs
      .filter(club => memberships.includes(club.id))
      .map(club => ({
        id: club.id,
        name: club.name,
        role: "Member",
        logo: club.logo,
      }));

  return (
    <UserContext.Provider value={{
      user,
      login,
      logout,
      updateUser,
      isLoggedIn: !!user,
      posts,
      clubs,
      memberships,
      addPost,
      deletePost,
      updatePost,
      updatePosts,
      createClub,
      joinClub,
      leaveClub,
      isClubJoined,
      getMembershipItems,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
