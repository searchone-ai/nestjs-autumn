export interface ClerkUser {
  userId: string;
  sessionId?: string;
  orgId?: string;
  orgRole?: string;
  orgSlug?: string;
  primaryEmailAddressId?: string;
  emailAddresses?: Array<{
    id: string;
    emailAddress: string;
  }>;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  hasImage?: boolean;
  createdAt?: number;
  updatedAt?: number;
  publicMetadata?: Record<string, unknown>;
  privateMetadata?: Record<string, unknown>;
  unsafeMetadata?: Record<string, unknown>;
}

