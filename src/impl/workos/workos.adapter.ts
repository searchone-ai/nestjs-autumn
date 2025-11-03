import type { Request } from 'express';
import type { AuthProviderAdapter, AutumnUserIdentity } from '../..';
import type { AuthenticatedUser } from './authenticated-user.interface';

export class WorkOSAdapter implements AuthProviderAdapter {
  async identify(req: Request): Promise<AutumnUserIdentity | null> {
    const user = (req as any).user as AuthenticatedUser | undefined;

    if (!user) {
      return null;
    }

    const customerId = user.organizationId || user.id;

    if (!customerId) {
      return null;
    }

    const customerData = {
      name:
        user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName}`
          : user.email?.split('@')[0] || 'User',
      email: user.email || '',
    };

    return {
      customerId,
      customerData,
    };
  }
}

