/**
 * AI Security Gateway - Anthropic Messages API handler
 *
 * Handles POST /v1/messages requests in Anthropic's native format.
 */
import type { IncomingMessage, ServerResponse } from "node:http";
import type { BackendConfig } from "../types.js";
/**
 * Handle Anthropic API request
 */
export declare function handleAnthropicRequest(req: IncomingMessage, res: ServerResponse, backend: BackendConfig): Promise<void>;
//# sourceMappingURL=anthropic.d.ts.map