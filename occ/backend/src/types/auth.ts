import type { User, Profile, UserSetting, PrivacySetting } from "@prisma/client";

export type AuthenticatedUser = User & {
  profile: Profile | null;
  settings: UserSetting | null;
  privacy: PrivacySetting | null;
};

export type JwtAccessPayload = {
  sub: string;
  role: User["role"];
  email: string;
};

export type JwtRefreshPayload = {
  sub: string;
  role: User["role"];
  tokenId: string;
};
