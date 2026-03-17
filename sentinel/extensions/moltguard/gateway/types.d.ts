/**
 * AI Security Gateway types
 */
export type MappingTable = Map<string, string>;
export type SanitizeResult = {
    sanitized: any;
    mappingTable: MappingTable;
    redactionCount: number;
};
export type ApiType = "anthropic" | "openai" | "gemini";
export type BackendConfig = {
    baseUrl: string;
    apiKey: string;
    type?: ApiType;
    pathPrefix?: string;
    models?: string[];
    referer?: string;
    title?: string;
};
export type GatewayConfig = {
    port: number;
    backends: {
        [name: string]: BackendConfig;
    };
    routing?: {
        [path: string]: string;
    };
    defaultBackends?: {
        anthropic?: string;
        openai?: string;
        gemini?: string;
    };
};
export type EntityMatch = {
    originalText: string;
    category: string;
    placeholder: string;
};
export type GatewayActivityEvent = {
    id: string;
    timestamp: string;
    requestId: string;
    type: "sanitize" | "restore";
    direction: "request" | "response";
    backend: string;
    endpoint: string;
    model?: string;
    redactionCount: number;
    categories: Record<string, number>;
    durationMs?: number;
};
export type ActivityListener = (event: GatewayActivityEvent) => void;
//# sourceMappingURL=types.d.ts.map