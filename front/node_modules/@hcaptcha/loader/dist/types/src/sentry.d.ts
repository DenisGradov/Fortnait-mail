import { ScopeTag, SentryHub } from './types';
export declare function initSentry(sentry: boolean, scopeTag?: ScopeTag): SentryHub | null;
export declare function getSentry(tag?: ScopeTag): SentryHub | null;
export declare function getSentryHubWrapper(sentryHub: any, tag?: ScopeTag): SentryHub;
