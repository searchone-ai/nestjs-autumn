import type { Request } from 'express';
import type { AuthProviderAdapter, AutumnUserIdentity } from '../..';

export class CustomAdapter implements AuthProviderAdapter {
    constructor(
        private readonly identifyFn: (req: Request) => Promise<AutumnUserIdentity | null>,
    ) { }

    async identify(req: Request): Promise<AutumnUserIdentity | null> {
        return this.identifyFn(req);
    }
}

