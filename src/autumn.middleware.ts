import { Injectable, NestMiddleware, Optional } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { autumnHandler } from 'autumn-js/express';
import type { AuthProviderAdapter } from './provider.interface';
import type { AutumnConfig } from './config.interface';
import { AuthProviderFactory } from './provider.factory';

@Injectable()
export class AutumnMiddleware implements NestMiddleware {
    private readonly adapter: AuthProviderAdapter;
    private readonly requireAuth: boolean;

    constructor(@Optional() private readonly config?: AutumnConfig) {
        this.adapter = AuthProviderFactory.create(config);
        this.requireAuth = config?.requireAuth !== false;
    }

    use(req: Request, res: Response, next: NextFunction) {
        const handler = autumnHandler({
            identify: async (req: any) => {
                const identity = await this.adapter.identify(req);

                if (!identity) {
                    if (this.requireAuth) {
                        throw new Error('User not authenticated');
                    }
                    return {
                        customerId: 'anonymous',
                        customerData: {
                            name: 'Anonymous',
                            email: '',
                        },
                    };
                }

                return identity;
            },
        });

        return handler(req, res, next);
    }
}

