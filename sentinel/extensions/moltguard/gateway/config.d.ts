/**
 * Gateway configuration management
 */
import type { GatewayConfig, ApiType } from "./types.js";
/**
 * Load gateway configuration from file or environment
 */
export declare function loadConfig(configPath?: string): GatewayConfig;
/**
 * Validate configuration
 */
export declare function validateConfig(config: GatewayConfig): void;
/**
 * Infer API type from backend name
 */
export declare function inferApiType(name: string): ApiType;
/**
 * Get API type for a backend
 */
export declare function getBackendApiType(name: string, config: GatewayConfig): ApiType;
/**
 * Find backend by API key
 */
export declare function findBackendByApiKey(apiKey: string, config: GatewayConfig): {
    name: string;
    backend: typeof config.backends[string];
} | null;
/**
 * Find default backend for an API type
 */
export declare function findDefaultBackend(apiType: ApiType, config: GatewayConfig): {
    name: string;
    backend: typeof config.backends[string];
} | null;
/**
 * Find backend by request path prefix
 * Matches the longest pathPrefix that is a prefix of the request path
 */
export declare function findBackendByPathPrefix(requestPath: string, config: GatewayConfig): {
    name: string;
    backend: typeof config.backends[string];
} | null;
/**
 * Find backend by model name
 */
export declare function findBackendByModel(modelName: string, config: GatewayConfig): {
    name: string;
    backend: typeof config.backends[string];
} | null;
//# sourceMappingURL=config.d.ts.map