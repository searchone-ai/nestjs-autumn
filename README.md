# @searchone/nestjs-autumn

NestJS package for integrating autumn-js analytics middleware with multiple authentication providers.

**Supports:** WorkOS, Clerk, BetterAuth, and custom authentication providers with **automatic detection**.
- [@searchone/nestjs-autumn](#searchonenestjs-autumn)
  - [Installation](#installation)
  - [Quick Start](#quick-start)
  - [Usage](#usage)
    - [Auto-Detection (Default)](#auto-detection-default)
    - [Explicit Provider Configuration](#explicit-provider-configuration)
    - [Custom Authentication](#custom-authentication)
    - [Optional Authentication](#optional-authentication)
  - [Configuration](#configuration)
  - [Customization](#customization)
    - [Custom Route Pattern](#custom-route-pattern)
    - [Extending Adapters](#extending-adapters)
  - [License](#license)

## Installation

```bash
npm install @searchone/nestjs-autumn
```

## Quick Start

Just import the module - it auto-detects your auth provider:

```typescript
import { Module } from '@nestjs/common';
import { AutumnModule } from '@searchone/nestjs-autumn';

@Module({
  imports: [AutumnModule], // Auto-detects provider
})
export class AppModule {}
```

## Usage

### Auto-Detection (Default)

The middleware automatically detects which authentication provider is installed at startup. Detection order: Clerk → BetterAuth → WorkOS.

```typescript
@Module({
  imports: [AutumnModule], // Auto-detects provider
})
export class AppModule {}
```

### Explicit Provider Configuration

You can explicitly specify a provider:

```typescript
// WorkOS
@Module({
  imports: [AutumnModule.forRoot({ provider: 'workos' })],
})
export class AppModule {}

// Clerk
@Module({
  imports: [AutumnModule.forRoot({ provider: 'clerk' })],
})
export class AppModule {}

// BetterAuth
@Module({
  imports: [AutumnModule.forRoot({ provider: 'betterauth' })],
})
export class AppModule {}
```

**Prerequisites:**
- **WorkOS**: User available on `req.user` as `AuthenticatedUser`
- **Clerk**: User available on `req.auth` or `req.clerk`
- **BetterAuth**: User available on `req.user` or `req.auth.user`

### Custom Authentication

Provide your own adapter for custom authentication:

```typescript
import { Module } from '@nestjs/common';
import { AutumnModule, CustomAdapter } from '@searchone/nestjs-autumn';
import type { Request } from 'express';

@Module({
  imports: [
    AutumnModule.forRoot({
      provider: 'custom',
      customAdapter: new CustomAdapter(async (req: Request) => {
        const user = req.myCustomAuth?.user;
        if (!user) return null;

        return {
          customerId: user.id,
          customerData: {
            name: user.name || 'User',
            email: user.email || '',
          },
        };
      }),
    }),
  ],
})
export class AppModule {}
```

### Optional Authentication

Allow anonymous users by disabling authentication requirement:

```typescript
@Module({
  imports: [
    AutumnModule.forRoot({
      provider: 'workos', // or 'clerk', 'betterauth', etc.
      requireAuth: false, // Allow anonymous users
    }),
  ],
})
export class AppModule {}
```

Anonymous users will be tracked with `customerId: 'anonymous'`.

## Configuration

```typescript
interface AutumnConfig {
  provider?: 'auto' | 'workos' | 'clerk' | 'betterauth' | 'custom';
  customAdapter?: AuthProviderAdapter; // Required if provider is 'custom'
  requireAuth?: boolean; // Default: true
}
```

## Customization

### Custom Route Pattern

Apply middleware to different routes:

```typescript
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AutumnMiddleware } from '@searchone/nestjs-autumn';

@Module({
  providers: [AutumnMiddleware],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AutumnMiddleware)
      .forRoutes('custom-route/*');
  }
}
```

### Extending Adapters

Extend existing adapters for custom behavior:

```typescript
import { WorkOSAdapter } from '@searchone/nestjs-autumn';
import type { Request } from 'express';

class CustomWorkOSAdapter extends WorkOSAdapter {
  async identify(req: Request) {
    const identity = await super.identify(req);
    if (identity) {
      identity.customerData.name = `[Premium] ${identity.customerData.name}`;
    }
    return identity;
  }
}
```

## License
MIT
