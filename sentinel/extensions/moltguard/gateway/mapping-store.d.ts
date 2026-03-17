/**
 * Persistent Mapping Store
 *
 * Maintains a global mapping between original values and placeholders.
 * This ensures the same sensitive data always gets the same placeholder,
 * allowing restoration to work across multiple requests in a conversation.
 */
import type { MappingTable } from "./types.js";
/**
 * Get or create a placeholder for an original value
 * If the value was seen before, returns the same placeholder
 */
export declare function getOrCreatePlaceholder(originalValue: string, entityType: string): string;
/**
 * Get the original value for a placeholder
 */
export declare function getOriginalValue(placeholder: string): string | undefined;
/**
 * Check if a string is a known placeholder
 */
export declare function isKnownPlaceholder(text: string): boolean;
/**
 * Get all placeholders and their original values as a MappingTable
 * This is used for restoration
 */
export declare function getGlobalMappingTable(): MappingTable;
/**
 * Get current statistics
 */
export declare function getMappingStats(): {
    totalMappings: number;
    byType: Record<string, number>;
};
/**
 * Clear all mappings (for testing or reset)
 */
export declare function clearMappings(): void;
//# sourceMappingURL=mapping-store.d.ts.map