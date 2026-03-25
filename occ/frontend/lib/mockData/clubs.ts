import { Club, ClubEvent, ClubGalleryItem, ClubMember } from "@/lib/dataProvider";

export interface ClubRecord extends Club {
  tagline: string;
  fullDescription: string;
  bannerImage: string;
  profileImage: string;
  bannerUrl?: string | null;
  isActive?: boolean;
  location: string;
  university: string;
  membersCount: number;
  eventsCount: number;
  members: ClubMember[];
  events: ClubEvent[];
  gallery: ClubGalleryItem[];
  isJoined?: boolean;
  isOwner?: boolean;
  visibility?: "PUBLIC" | "PRIVATE";
  membershipRole?: "OWNER" | "ADMIN" | "MEMBER" | null;
  hasPendingJoinRequest?: boolean;
  canJoin?: boolean;
  canRequestToJoin?: boolean;
  canLeave?: boolean;
  canEdit?: boolean;
  canPost?: boolean;
  approvalStatus?: "PENDING" | "APPROVED" | "REJECTED";
  createdAt?: string;
  updatedAt?: string;
  reviewedAt?: string | null;
  rejectionReason?: string | null;
  owner?: {
    id?: string;
    email?: string;
    profile?: {
      displayName?: string | null;
      university?: string | null;
      phoneNumber?: string | null;
    } | null;
  } | null;
  reviewedByAdmin?: {
    id?: string;
    email?: string;
    profile?: {
      displayName?: string | null;
    } | null;
  } | null;
}

export const mockClubs: ClubRecord[] = [];
