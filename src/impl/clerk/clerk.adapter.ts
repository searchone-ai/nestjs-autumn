import type { Request } from 'express';
import type { AuthProviderAdapter, AutumnUserIdentity } from '../../';
import type { ClerkUser } from './clerk-user.interface';

export class ClerkAdapter implements AuthProviderAdapter {
  async identify(req: Request): Promise<AutumnUserIdentity | null> {
    const clerkAuth = (req as any).auth || (req as any).clerk;

    if (!clerkAuth) {
      return null;
    }

    const userId = clerkAuth.userId || clerkAuth.id;
    if (!userId) {
      return null;
    }

    const orgId = clerkAuth.orgId || clerkAuth.organizationId;

    const user: ClerkUser | undefined = clerkAuth.user || clerkAuth;

    let email = '';
    if (user?.emailAddresses && user.emailAddresses.length > 0) {
      const primaryEmail = user.primaryEmailAddressId
        ? user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
        : user.emailAddresses[0];
      email = primaryEmail?.emailAddress || '';
    } else if ((user as any)?.emailAddress) {
      email = (user as any).emailAddress;
    }

    let name = 'User';
    if (user?.firstName && user?.lastName) {
      name = `${user.firstName} ${user.lastName}`;
    } else if (user?.firstName) {
      name = user.firstName;
    } else if (email) {
      name = email.split('@')[0];
    }

    const customerId = orgId || userId;

    return {
      customerId,
      customerData: {
        name,
        email,
      },
    };
  }
}

