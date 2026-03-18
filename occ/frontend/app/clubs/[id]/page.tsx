"use client";

import { useState, useCallback, useEffect } from "react";
import { Users, Calendar, MapPin, UserPlus, UserMinus } from "lucide-react";
import { useUser } from "@/context/UserContext";
import PostCard from "@/components/PostCard";
import InteractiveGrid from "@/components/InteractiveGrid";
import { useRouter } from "next/navigation";
import { ClubRecord } from "@/lib/mockData/clubs";

interface ClubPageProps {
  params: Promise<{ id: string }>;
}

export default function ClubPage({ params }: ClubPageProps) {
  const { isLoggedIn, posts, clubs, joinClub, leaveClub, isClubJoined } = useUser();
  const router = useRouter();
  const [showJoinSuccess, setShowJoinSuccess] = useState(false);
  const [clubId, setClubId] = useState<string>("");

  // Unwrap params Promise
  useEffect(() => {
    params.then(({ id }) => {
      setClubId(id);
    });
  }, [params]);

  // Filter posts by club
  const clubPosts = posts.filter(post => post.clubId === clubId);
  const club = clubs.find(item => item.id === clubId) as ClubRecord | undefined;
  const isJoined = clubId ? isClubJoined(clubId) : false;

  const redirectToLogin = useCallback(() => {
    router.push(`/login?next=${encodeURIComponent(clubId ? `/clubs/${clubId}` : "/explore")}`);
  }, [clubId, router]);

  const handleJoinClub = useCallback(() => {
    if (!isLoggedIn) {
      redirectToLogin();
      return;
    }
    if (!clubId) return;
    joinClub(clubId);
    setShowJoinSuccess(true);
    setTimeout(() => setShowJoinSuccess(false), 3000);
  }, [clubId, isLoggedIn, joinClub, redirectToLogin]);

  const handleLeaveClub = useCallback(() => {
    if (!clubId) return;
    leaveClub(clubId);
  }, [clubId, leaveClub]);

  if (!clubId || !club) {
    return (
      <div className="min-h-screen bg-brutal-gray flex items-center justify-center">
        <div className="bg-white border-4 border-black p-12 shadow-[8px_8px_0_0_#000] text-center">
          <h1 className="text-4xl font-black uppercase mb-4">Loading Club...</h1>
        </div>
      </div>
    );
  }

  const safeBannerImage = club.bannerImage?.trim() || "/window.svg";
  const safeProfileImage = club.profileImage?.trim() || club.logo?.trim() || "/globe.svg";

  return (
    <div className="min-h-screen bg-brutal-gray">
      {/* Club Banner Header */}
      <div className="relative">
        <div
          className="h-64 md:h-80 bg-cover bg-center border-b-8 border-black"
          style={{ backgroundImage: `url(${safeBannerImage})` }}
        >
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        <div className="bg-white border-b-8 border-black relative overflow-hidden">
          <InteractiveGrid variant="page" scope="container" />
          <div className="absolute inset-0 bg-white/78"></div>
          <div className="max-w-7xl mx-auto pl-2 pr-4 py-8">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-8 -mt-16 md:-mt-20 relative z-10">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-8 border-white shadow-[8px_8px_0_0_#000] bg-cover bg-center flex-shrink-0 ring-4 ring-brutal-blue"
                   style={{ backgroundImage: `url(${safeProfileImage})` }}>
              </div>

              <div className="flex-1 mt-8 md:mt-6">
                <h1 className="text-4xl md:text-6xl font-black uppercase leading-[0.85] tracking-tighter mb-4">
                  {club.name}
                </h1>
                <p className="text-xl md:text-2xl font-black text-brutal-blue">
                  {club.tagline}
                </p>
              </div>

              <div className="flex-shrink-0 mt-8 md:mt-0">
                {showJoinSuccess && (
                  <div className="mb-4 bg-green-500 text-white p-3 border-4 border-black shadow-[4px_4px_0_0_#000] font-black uppercase text-sm">
                    Joined {club.name}!
                  </div>
                )}

                {isJoined ? (
                  <button
                    onClick={handleLeaveClub}
                    className="bg-white text-black px-8 py-4 font-black uppercase border-4 border-black shadow-[6px_6px_0_0_#000] hover:shadow-[8px_8px_0_0_rgba(37,64,255,0.3)] hover:scale-105 hover:-translate-x-1 hover:-translate-y-1 transition-all flex items-center gap-2"
                  >
                    <UserMinus className="w-5 h-5" /> Leave Club
                  </button>
                ) : (
                  <button
                    onClick={handleJoinClub}
                    className="bg-black text-white px-8 py-4 font-black uppercase border-4 border-black shadow-[6px_6px_0_0_#1d2cf3] hover:shadow-[8px_8px_0_0_rgba(37,64,255,0.4)] hover:scale-105 hover:-translate-x-1 hover:-translate-y-1 transition-all flex items-center gap-2"
                  >
                    <UserPlus className="w-5 h-5" /> Join Club
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-24">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <div className="bg-white border-4 border-black border-t-8 border-t-brutal-blue p-8 shadow-[8px_8px_0_0_#000] text-center">
            <Users className="w-12 h-12 mx-auto mb-4" />
            <p className="text-5xl font-black mb-2">{club.membersCount}</p>
            <p className="font-black uppercase text-sm text-gray-600 tracking-widest">Members</p>
          </div>
          <div className="bg-white border-4 border-black border-t-8 border-t-brutal-blue p-8 shadow-[8px_8px_0_0_#000] text-center">
            <Calendar className="w-12 h-12 mx-auto mb-4" />
            <p className="text-5xl font-black mb-2">{club.eventsCount}</p>
            <p className="font-black uppercase text-sm text-gray-600 tracking-widest">Events</p>
          </div>
          <div className="bg-white border-4 border-black border-t-8 border-t-brutal-blue p-8 shadow-[8px_8px_0_0_#000] text-center">
            <MapPin className="w-12 h-12 mx-auto mb-4" />
            <p className="text-lg font-black mb-2">{club.location}</p>
            <p className="font-black uppercase text-sm text-gray-600 tracking-widest">Location</p>
          </div>
        </div>

        <div className="mb-24">
          <div className="h-1 bg-gradient-to-r from-brutal-blue via-brutal-blue to-transparent w-32"></div>
        </div>

        {/* About */}
        <div className="bg-white border-4 border-black border-l-8 border-l-brutal-blue p-8 shadow-[8px_8px_0_0_#000] mb-24">
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-6 border-b-4 border-black pb-4">
            About This Club
          </h2>
          <p className="text-lg font-bold text-gray-700 leading-relaxed mb-6">{club.description}</p>
          <p className="text-lg font-bold text-gray-700 leading-relaxed">{club.fullDescription}</p>
        </div>

        <div className="mb-24">
          <div className="h-1 bg-gradient-to-r from-brutal-blue via-brutal-blue to-transparent w-32"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          {/* Members */}
          <div className="bg-white border-4 border-black border-l-8 border-l-brutal-blue p-8 shadow-[8px_8px_0_0_#000]">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-6 border-b-4 border-black pb-4">
              Members ({club.members.length})
            </h2>
            {club.members.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {club.members.map(member => (
                  <div key={member.id} className="flex items-center gap-4 p-4 border-2 border-black bg-brutal-gray">
                    <div
                      className="w-12 h-12 rounded-full bg-cover bg-center border-2 border-black"
                      style={{ backgroundImage: `url(${member.avatar?.trim() || "/globe.svg"})` }}
                    ></div>
                    <div>
                      <p className="font-black text-lg">{member.name}</p>
                      <p className="font-bold text-sm text-gray-600 uppercase tracking-widest">{member.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 font-bold text-gray-500">No members to display</p>
            )}
          </div>

          {/* Events */}
          <div className="bg-white border-4 border-black border-l-8 border-l-brutal-blue p-8 shadow-[8px_8px_0_0_#000]">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-6 border-b-4 border-black pb-4">
              Upcoming Events
            </h2>
            {club.events.length > 0 ? (
              <div className="space-y-4">
                {club.events.map(event => (
                  <div key={event.id} className="border-4 border-black p-4 bg-brutal-gray">
                    <h3 className="font-black text-lg uppercase mb-2">{event.title}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span className="font-bold text-sm">{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="w-4 h-4" />
                      <span className="font-bold text-sm">{event.location}</span>
                    </div>
                    <p className="font-bold text-gray-700">{event.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 font-bold text-gray-500">No upcoming events</p>
            )}
          </div>
        </div>

        <div className="mb-24">
          <div className="h-1 bg-gradient-to-r from-brutal-blue via-brutal-blue to-transparent w-32"></div>
        </div>

        {/* Club Posts */}
        <div className="bg-white border-4 border-black border-l-8 border-l-brutal-blue p-8 shadow-[8px_8px_0_0_#000] mb-24">
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-3xl font-black uppercase tracking-tighter border-b-4 border-black pb-4">
              Club Posts ({clubPosts.length})
            </h2>
            <div className="bg-brutal-blue text-white px-4 py-2 font-black uppercase text-sm border-2 border-black shadow-[2px_2px_0_0_#000]">
              {club.name}
            </div>
          </div>
          {clubPosts.length > 0 ? (
            <div className="space-y-8">
              {clubPosts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="font-bold text-gray-500 text-lg mb-4">No posts from this club yet.</p>
              <p className="font-bold text-gray-400">Be the first to share something with the community!</p>
            </div>
          )}
        </div>

        <div className="mb-24">
          <div className="h-1 bg-gradient-to-r from-brutal-blue via-brutal-blue to-transparent w-32"></div>
        </div>

        {/* Gallery */}
        <div className="bg-white border-4 border-black border-l-8 border-l-brutal-blue p-8 shadow-[8px_8px_0_0_#000]">
          <h2 className="text-3xl font-black uppercase tracking-tighter mb-6 border-b-4 border-black pb-4">
            Club Media
          </h2>
          {club.gallery.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {club.gallery.map(item => (
                <div key={item.id} className="border-4 border-black shadow-[4px_4px_0_0_#000] overflow-hidden hover:shadow-[6px_6px_0_0_rgba(37,64,255,0.3)] hover:-translate-y-1 transition-all">
                  <div
                    className="aspect-square bg-cover bg-center"
                    style={{ backgroundImage: `url(${item.image?.trim() || "/window.svg"})` }}
                  ></div>
                  <div className="p-3 bg-white border-t-2 border-t-brutal-blue">
                    <p className="font-bold text-sm">{item.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-12 font-bold text-gray-500">No media to display</p>
          )}
        </div>
      </div>
    </div>
  );
}
