/**
 * AI Security Gateway - OpenAI Chat Completions API handler
 *
 * Handles POST /v1/chat/completions requests in OpenAI's format.
 * Also compatible with OpenAI-compatible APIs (Kimi, DeepSeek, etc.)
 */
import type { IncomingMessage, ServerResponse } from "node:http";
import type { BackendConfig } from "../types.js";
/**
 * Handle OpenAI API request
 *
 * @param backend - Config for OpenAI-compatible backend
 * @param extraHeaders - Optional additional headers (e.g., OpenRouter attribution)
 */
export declare function handleOpenAIRequest(req: IncomingMessage, res: ServerResponse, backend: BackendConfig, extraHeaders?: Record<string, string>): Promise<void>;
//# sourceMappingURL=openai.d.ts.map