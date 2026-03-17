/**
 * Gateway Activity Logger
 *
 * Tracks sanitization and restoration events for monitoring.
 */
import type { ActivityListener, MappingTable } from "./types.js";
/**
 * Generate a unique request ID
 */
export declare function generateRequestId(): string;
/**
 * Register an activity listener
 */
export declare function addActivityListener(listener: ActivityListener): void;
/**
 * Remove an activity listener
 */
export declare function removeActivityListener(listener: ActivityListener): void;
/**
 * Clear all activity listeners
 */
export declare function clearActivityListeners(): void;
/**
 * Count categories from mapping table
 * Handles both old format (__email_1__) and new format (__PII_EMAIL_ADDRESS_00000001__)
 */
export declare function countCategories(mappingTable: MappingTable): Record<string, number>;
/**
 * Log a sanitization event (request going out)
 */
export declare function logSanitizeEvent(params: {
    requestId: string;
    backend: string;
    endpoint: string;
    model?: string;
    mappingTable: MappingTable;
    redactionCount: number;
    durationMs?: number;
}): void;
/**
 * Log a restoration event (response coming back)
 */
export declare function logRestoreEvent(params: {
    requestId: string;
    backend: string;
    endpoint: string;
    model?: string;
    mappingTable: MappingTable;
    restorationCount: number;
    durationMs?: number;
}): void;
//# sourceMappingURL=activity.d.ts.map