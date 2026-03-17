/**
 * AI Security Gateway - Content Sanitizer
 *
 * Sanitizes sensitive data in a single request-response cycle.
 * Placeholder format: __PII_<ENTITY_TYPE>_<SERIAL_ID>__
 */
import type { SanitizeResult } from "./types.js";
/**
 * Sanitize any content (messages array, object, string)
 * Returns sanitized content and mapping table for restoration
 */
export declare function sanitize(content: unknown): SanitizeResult;
/**
 * Sanitize messages array (common case for LLM APIs)
 */
export declare function sanitizeMessages(messages: unknown[]): SanitizeResult;
//# sourceMappingURL=sanitizer.d.ts.map