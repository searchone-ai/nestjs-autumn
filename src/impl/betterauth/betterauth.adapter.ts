import type { Request } from 'express';
import type { AuthProviderAdapter, AutumnUserIdentity } from '../..';
import type { BetterAuthUser } from './betterauth-user.interface';

export class BetterAuthAdapter implements AuthProviderAdapter {
  async identify(req: Request): Promise<AutumnUserIdentity | null> {
    const betterAuth = (req as any).auth || {};
    const user: BetterAuthUser | undefined = (req as any).user || betterAuth.user;

    if (!user) {
      return null;
    }

    const userId = user.id;
    if (!userId) {
      return null;
    }

    const email = user.email || '';

    let name = 'User';
    if (user.name) {
      name = user.name;
    } else if (email) {
      name = email.split('@')[0];
    }

    const orgId = (user as any).organizationId || (user as any).orgId;

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

