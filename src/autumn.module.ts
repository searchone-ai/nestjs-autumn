import {
    Module,
    NestModule,
    MiddlewareConsumer,
    RequestMethod,
    DynamicModule,
} from '@nestjs/common';
import { AutumnMiddleware } from './autumn.middleware';
import type { AutumnConfig } from './config.interface';

/**
 * NestJS module that configures the Autumn analytics middleware.
 * 
 * Applies the middleware to all routes matching the pattern 'autumn/*path'.
 * 
 * Supports multiple authentication providers with automatic detection by default.
 * The middleware automatically detects which auth provider libraries are installed
 * (WorkOS, Clerk, BetterAuth) and uses the appropriate adapter unless explicitly configured.
 * 
 * @example
 * ```typescript
 * // Default (Auto-detection from installed packages)
 * import { AutumnModule } from '@searchone/nestjs-autumn';
 * 
 * @Module({
 *   imports: [AutumnModule],
 * })
 * export class AppModule {}
 * 
 * // Explicitly use Clerk
 * @Module({
 *   imports: [AutumnModule.forRoot({ provider: 'clerk' })],
 * })
 * export class AppModule {}
 * 
 * // Explicitly use BetterAuth
 * @Module({
 *   imports: [AutumnModule.forRoot({ provider: 'betterauth' })],
 * })
 * export class AppModule {}
 * 
 * // Explicitly enable auto-detection
 * @Module({
 *   imports: [AutumnModule.forRoot({ provider: 'auto' })],
 * })
 * export class AppModule {}
 * 
 * // With custom adapter
 * import { CustomAdapter } from '@searchone/nestjs-autumn';
 * 
 * @Module({
 *   imports: [AutumnModule.forRoot({
 *     provider: 'custom',
 *     customAdapter: new CustomAdapter(async (req) => {
 *       // Your custom logic
 *       return { customerId: '...', customerData: { name: '...', email: '...' } };
 *     }),
 *   })],
 * })
 * export class AppModule {}
 * ```
 */
@Module({
    providers: [AutumnMiddleware],
    exports: [AutumnMiddleware],
})
export class AutumnModule implements NestModule {
    static forRoot(config?: AutumnConfig): DynamicModule {
        return {
            module: AutumnModule,
            providers: [
                {
                    provide: AutumnMiddleware,
                    useFactory: () => new AutumnMiddleware(config),
                },
            ],
            exports: [AutumnMiddleware],
        };
    }

    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AutumnMiddleware)
            .forRoutes({ path: 'autumn/*path', method: RequestMethod.ALL });
    }
}

