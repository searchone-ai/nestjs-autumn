import type { AuthProviderAdapter } from './provider.interface';
import type { AutumnConfig } from './config.interface';
import { WorkOSAdapter } from './impl/workos';
import { ClerkAdapter } from './impl/clerk';
import { BetterAuthAdapter } from './impl/betterauth';
import { getDefaultProvider } from './utils/provider-detector';

export class AuthProviderFactory {
    static create(config?: AutumnConfig): AuthProviderAdapter {
        if (config?.provider && typeof config.provider !== 'string') {
            return config.provider;
        }

        if (config?.customAdapter) {
            return config.customAdapter;
        }

        let provider: string | AuthProviderAdapter | undefined = config?.provider;

        if (!provider || provider === 'auto') {
            provider = getDefaultProvider();
        }

        switch (provider) {
            case 'workos':
                return new WorkOSAdapter();
            case 'clerk':
                return new ClerkAdapter();
            case 'betterauth':
                return new BetterAuthAdapter();
            case 'custom':
                if (!config?.customAdapter) {
                    throw new Error(
                        'Custom adapter must be provided when provider is set to "custom"',
                    );
                }
                return config.customAdapter;
            default:
                const defaultProvider = getDefaultProvider();
                switch (defaultProvider) {
                    case 'clerk':
                        return new ClerkAdapter();
                    case 'betterauth':
                        return new BetterAuthAdapter();
                    case 'workos':
                    default:
                        return new WorkOSAdapter();
                }
        }
    }
}

