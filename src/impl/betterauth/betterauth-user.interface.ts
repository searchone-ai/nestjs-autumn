export interface BetterAuthUser {
  id: string;
  email: string;
  emailVerified: boolean;
  name?: string;
  image?: string;
  createdAt: Date | string | number;
  updatedAt: Date | string | number;
  session?: {
    id: string;
    userId: string;
    expiresAt: Date | string | number;
  };
  account?: {
    id: string;
    userId: string;
    provider: string;
    providerAccountId: string;
  };
}

