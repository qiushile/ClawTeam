/**
 * AI Security Gateway - Google Gemini API handler
 *
 * Handles POST /v1/models/:model:generateContent requests in Gemini's format.
 */
import type { IncomingMessage, ServerResponse } from "node:http";
import type { BackendConfig } from "../types.js";
/**
 * Handle Gemini API request
 */
export declare function handleGeminiRequest(req: IncomingMessage, res: ServerResponse, backend: BackendConfig, modelName: string): Promise<void>;
//# sourceMappingURL=gemini.d.ts.map