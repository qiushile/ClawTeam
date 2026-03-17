/**
 * AI Security Gateway - Content Restorer
 *
 * Restores sanitized placeholders back to original values.
 * Handles LLM corruption patterns (missing underscores, case variations).
 *
 * Placeholder format: __PII_<ENTITY_TYPE>_<SERIAL_ID>__
 */
import type { MappingTable } from "./types.js";
/**
 * Restore any content (object, array, string) using the mapping table
 */
export declare function restore(content: unknown, mappingTable: MappingTable): unknown;
/**
 * Restore a JSON string
 * Useful for SSE streaming where each chunk is a JSON string
 */
export declare function restoreJSON(jsonString: string, mappingTable: MappingTable): string;
/**
 * Restore SSE data line (for streaming responses)
 * Format: "data: {...}\n"
 */
export declare function restoreSSELine(line: string, mappingTable: MappingTable): string;
/**
 * StreamRestorer - Stateful streaming restoration with smart buffering
 *
 * Only buffers when `__` is detected (potential placeholder start).
 * Otherwise streams through immediately for best UX.
 */
export declare class StreamRestorer {
    private buffer;
    private mappingTable;
    constructor(mappingTable: MappingTable);
    /**
     * Process incoming text chunk
     * Returns text that can be safely output (already restored or confirmed non-placeholder)
     */
    process(chunk: string): string;
    /**
     * Flush what we can safely output
     * Keeps potential incomplete placeholders in buffer
     */
    private flush;
    /**
     * Check if text could be the start of a placeholder
     * Returns true if it matches the beginning of __PII_<TYPE>_<ID>__
     */
    private couldBePlaceholder;
    /**
     * Finalize stream - flush any remaining buffer
     * Call this at end of stream to ensure nothing is lost
     */
    finalize(): string;
    /**
     * Check if there's pending data in buffer
     */
    hasPendingData(): boolean;
}
/**
 * Create a streaming restorer for a response
 */
export declare function createStreamRestorer(mappingTable: MappingTable): StreamRestorer;
//# sourceMappingURL=restorer.d.ts.map