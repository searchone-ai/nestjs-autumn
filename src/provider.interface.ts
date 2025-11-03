import type { Request } from 'express';

export interface AutumnUserIdentity {
  customerId: string;
  customerData: {
    name: string;
    email: string;
  };
}

export interface AuthProviderAdapter {
  identify(req: Request): Promise<AutumnUserIdentity | null>;
}

