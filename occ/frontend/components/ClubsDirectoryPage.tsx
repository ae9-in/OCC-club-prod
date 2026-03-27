"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import ClubCard from "@/components/ClubCard";
import ClubFormModal from "@/components/ClubFormModal";
import InteractiveGrid from "@/components/InteractiveGrid";
import { Search, Map, Filter, Globe, X } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { usePathname, useRouter } from "next/navigation";
import { listClubPageFromApi, toClubRecord, type ClubUpsertInput } from "@/lib/clubApi";
import SiteContainer from "@/components/SiteContainer";

export default function ClubsDirectoryPage() {
  const { clubs, createClub, isLoggedIn } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [showMapView, setShowMapView] = useState(false);
  const [showCreateClub, setShowCreateClub] = useState(false);
  const [isSubmittingClub, setIsSubmittingClub] = useState(false);
  const [directoryClubs, setDirectoryClubs] = useState(() =>
    clubs.filter((club) => club.approvalStatus === "APPROVED"),
  );
  const [isLoadingClubs, setIsLoadingClubs] = useState(directoryClubs.length === 0);
  const [currentPage, setCurrentPage] = useState(directoryClubs.length > 0 ? 1 : 0);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    category: "all",
    university: "all",
    memberCount: "all"
  });

  useEffect(() => {
    let active = true;

    const loadFirstPage = async () => {
      setIsLoadingClubs(true);
      try {
        const response = await listClubPageFromApi(1, 24);
        if (!active) return;
        setDirectoryClubs(response.items.map((club) => toClubRecord(club)));
        setCurrentPage(response.page);
        setTotalPages(response.totalPages);
      } catch {
        if (!active) return;
        setDirectoryClubs(clubs.filter((club) => club.approvalStatus === "APPROVED"));
        setCurrentPage(1);
        setTotalPages(1);
      } finally {
        if (active) {
          setIsLoadingClubs(false);
        }
      }
    };

    void loadFirstPage();

    return () => {
      active = false;
    };
  }, [clubs]);

  const filteredClubs = useMemo(() => directoryClubs.filter((club) => {
    const isPubliclyApproved = club.approvalStatus !== "PENDING" && club.approvalStatus !== "REJECTED";
    if (!isPubliclyApproved) {
      return false;
    }
    const matchesSearch =
      club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      club.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filters.category === "all" || club.category === filters.category;
    const matchesUniversity = filters.university === "all" || club.university === filters.university;
    const matchesMemberCount =
      filters.memberCount === "all" ||
      (filters.memberCount === "small" && (club.membersCount ?? 0) <= 50) ||
      (filters.memberCount === "medium" && (club.membersCount ?? 0) > 50 && (club.membersCount ?? 0) <= 200) ||
      (filters.memberCount === "large" && (club.membersCount ?? 0) > 200);
    return matchesSearch && matchesCategory && matchesUniversity && matchesMemberCount;
  }), [directoryClubs, filters.category, filters.memberCount, filters.university, searchTerm]);

  const uniqueUniversities = useMemo(
    () => [...new Set(directoryClubs.map((club) => club.university).filter(Boolean))],
    [directoryClubs],
  );

  const openCreateClub = useCallback(() => {
    if (!isLoggedIn) {
      router.push(`/login?next=${encodeURIComponent(pathname ?? "/clubs")}`);
      return;
    }
    setShowCreateClub(true);
  }, [isLoggedIn, pathname, router]);

  const closeCreateClub = useCallback(() => setShowCreateClub(false), []);

  const handleCreateClub = useCallback(async (clubForm: ClubUpsertInput & { logoPreview?: string; bannerPreview?: string }) => {
    if (!clubForm.name.trim() || !clubForm.description.trim()) return;

    setIsSubmittingClub(true);
    try {
      const newClubId = await createClub(clubForm);
      closeCreateClub();
      if (newClubId) {
        setDirectoryClubs((prev) => {
          const createdClub = clubs.find((club) => club.id === newClubId || club.slug === newClubId);
          if (!createdClub || createdClub.approvalStatus !== "APPROVED") {
            return prev;
          }
          if (prev.some((club) => club.id === createdClub.id)) {
            return prev;
          }
          return [createdClub, ...prev];
        });
        router.push(`/clubs/${newClubId}`);
      }
    } finally {
      setIsSubmittingClub(false);
    }
  }, [closeCreateClub, clubs, createClub, router]);

  const handleLoadMore = useCallback(async () => {
    if (isLoadingClubs || currentPage >= totalPages) {
      return;
    }

    setIsLoadingClubs(true);
    try {
      const nextPage = currentPage + 1;
      const response = await listClubPageFromApi(nextPage, 24);
      setDirectoryClubs((prev) => {
        const nextItems = response.items.map((club) => toClubRecord(club));
        const seenIds = new Set(prev.map((club) => club.id));
        return [...prev, ...nextItems.filter((club) => !seenIds.has(club.id))];
      });
      setCurrentPage(response.page);
      setTotalPages(response.totalPages);
    } finally {
      setIsLoadingClubs(false);
    }
  }, [currentPage, isLoadingClubs, totalPages]);

  return (
    <div className="min-h-screen bg-brutal-gray">
      <div className="relative overflow-hidden border-b-8 border-black bg-white py-12 md:py-24">
        <InteractiveGrid variant="page" scope="container" />
        <div className="absolute inset-0 bg-white/72"></div>
        <div className="absolute right-0 top-0 h-full w-1/3 -translate-x-[-50%] -skew-x-12 bg-brutal-blue opacity-5"></div>
        <SiteContainer className="relative z-10">
          <div className="mb-6 flex items-center gap-4 text-brutal-blue">
            <Globe className="h-6 w-6" />
            <span className="font-black uppercase tracking-[0.22em]">Clubs Directory</span>
          </div>
          <h1 className="mb-8 text-6xl font-black uppercase leading-[0.85] tracking-tighter md:text-9xl">
            Off Campus <br />
            <span className="inline-block bg-black px-6 text-white shadow-[12px_12px_0_0_#1d2cf3]">Clubs</span>
          </h1>
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="max-w-xl border-l-8 border-black bg-brutal-gray p-6 pl-8 text-2xl font-black shadow-[6px_6px_0_0_#000]">
              Browse approved clubs, join what fits, and submit new student circles for admin review before they go live.
          </p>
            <div className="w-full space-y-4 md:w-[450px]">
              <div className="group relative">
                <input
                  type="text"
                  placeholder="SEARCH CLUBS, TAGS, CATEGORIES..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border-4 border-black bg-white p-6 text-xl font-black text-black shadow-[6px_6px_0_0_#000] transition-all placeholder:text-gray-300 focus:outline-none focus:shadow-[8px_8px_0_0_#1d2cf3]"
                />
                <Search className="absolute right-6 top-1/2 h-8 w-8 -translate-y-1/2 text-black transition-colors group-focus-within:text-brutal-blue" />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowFilter((prev) => !prev)}
                  className={`flex-1 border-4 border-black py-3 font-black uppercase text-sm shadow-[4px_4px_0_0_#000] transition-all ${showFilter ? "bg-black text-white" : "bg-white text-black hover:bg-black hover:text-white hover:shadow-none"}`}
                >
                  <span className="flex items-center justify-center gap-2"><Filter className="h-4 w-4" /> Filter</span>
                </button>
                <button
                  onClick={() => setShowMapView((prev) => !prev)}
                  className={`flex-1 border-4 border-black py-3 font-black uppercase text-sm shadow-[4px_4px_0_0_#000] transition-all ${showMapView ? "bg-black text-white" : "bg-white text-black hover:bg-black hover:text-white hover:shadow-none"}`}
                >
                  <span className="flex items-center justify-center gap-2"><Map className="h-4 w-4" /> Map View</span>
                </button>
              </div>
            </div>
          </div>
        </SiteContainer>
      </div>

      <SiteContainer className="py-20">
        <div className="mb-16 flex items-baseline gap-4">
          <h2 className="text-4xl font-black uppercase tracking-tighter md:text-5xl">
            {showMapView ? "Club Map" : "Approved Clubs"}
          </h2>
          <span className="text-xl font-black uppercase text-gray-400">({filteredClubs.length})</span>
        </div>

        {showFilter ? (
          <div className="mb-12 border-4 border-black bg-white p-8 shadow-[8px_8px_0_0_#000]">
            <div className="mb-6 flex items-center justify-between border-b-4 border-black pb-4">
              <h3 className="text-2xl font-black uppercase">Filters</h3>
              <button onClick={() => setShowFilter(false)} aria-label="Close filters">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-black uppercase tracking-widest text-gray-600">Category</label>
                <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} className="occ-select">
                  <option value="all">All Categories</option>
                  <option value="Creative">Creative</option>
                  <option value="Sports">Sports</option>
                  <option value="Music">Music</option>
                  <option value="Fitness">Fitness</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-black uppercase tracking-widest text-gray-600">College</label>
                <select value={filters.university} onChange={(e) => setFilters({ ...filters, university: e.target.value })} className="occ-select">
                  <option value="all">All Colleges</option>
                  {uniqueUniversities.map((university) => (
                    <option key={university} value={university}>{university}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-black uppercase tracking-widest text-gray-600">Size</label>
                <select value={filters.memberCount} onChange={(e) => setFilters({ ...filters, memberCount: e.target.value })} className="occ-select">
                  <option value="all">Any Size</option>
                  <option value="small">Small (1-50)</option>
                  <option value="medium">Medium (51-200)</option>
                  <option value="large">Large (200+)</option>
                </select>
              </div>
            </div>
          </div>
        ) : null}

        {showMapView ? (
          <div className="border-4 border-black bg-white p-12 text-center shadow-[8px_8px_0_0_#000]">
            <div className="mb-8 border-4 border-black bg-brutal-gray p-20">
              <Map className="mx-auto mb-6 h-24 w-24 text-gray-400" />
              <h3 className="mb-4 text-4xl font-black uppercase">Interactive Club Map</h3>
              <p className="text-lg font-bold text-gray-600">Coming soon: explore clubs by location and see nearby activity hotspots.</p>
            </div>
            <button onClick={() => setShowMapView(false)} className="border-4 border-black bg-black px-8 py-4 font-black uppercase text-white shadow-[6px_6px_0_0_#1d2cf3] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none">
              Back to Grid View
            </button>
          </div>
        ) : (
          <>
            {isLoadingClubs && directoryClubs.length === 0 ? (
              <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="h-[320px] animate-pulse border-4 border-black bg-white p-6 shadow-[6px_6px_0_0_#000]" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
                {filteredClubs.map((club) => (
                  <ClubCard key={club.id} club={club} />
                ))}
                <button type="button" onClick={openCreateClub} className="flex min-h-[300px] w-full cursor-pointer flex-col items-center justify-center border-4 border-dashed border-black bg-white p-8 text-center transition-all hover:border-solid">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-black text-white transition-transform hover:scale-110">
                    <span className="text-5xl font-black leading-none">+</span>
                  </div>
                  <h3 className="mb-2 text-2xl font-black uppercase">Start a New Club</h3>
                  <p className="font-bold text-gray-500">Can&apos;t find your circle yet? Submit it for OCC review.</p>
                </button>
              </div>
            )}

            {currentPage < totalPages ? (
              <div className="mt-12 flex justify-center">
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={isLoadingClubs}
                  className="border-4 border-black bg-white px-8 py-4 font-black uppercase shadow-[6px_6px_0_0_#000] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none disabled:opacity-60"
                >
                  {isLoadingClubs ? "Loading..." : "Load More Clubs"}
                </button>
              </div>
            ) : null}
          </>
        )}
      </SiteContainer>

      {showCreateClub ? (
        <ClubFormModal mode="create" isSubmitting={isSubmittingClub} onClose={closeCreateClub} onSubmit={handleCreateClub} />
      ) : null}
    </div>
  );
}
