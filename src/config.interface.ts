import type { AuthProviderAdapter } from './provider.interface';

export interface AutumnConfig {
    provider?: 'auto' | 'workos' | 'clerk' | 'betterauth' | 'custom' | AuthProviderAdapter;
    customAdapter?: AuthProviderAdapter;
    requireAuth?: boolean;
}

