/**
 * Persistent Mapping Store
 *
 * Maintains a global mapping between original values and placeholders.
 * This ensures the same sensitive data always gets the same placeholder,
 * allowing restoration to work across multiple requests in a conversation.
 */
// Global mapping: original value -> placeholder
const originalToPlaceholder = new Map();
// Global mapping: placeholder -> original value (reverse lookup for restoration)
const placeholderToOriginal = new Map();
// Global counter per entity type
const typeCounters = new Map();
/**
 * Get or create a placeholder for an original value
 * If the value was seen before, returns the same placeholder
 */
export function getOrCreatePlaceholder(originalValue, entityType) {
    // Check if we already have a placeholder for this value
    const existing = originalToPlaceholder.get(originalValue);
    if (existing) {
        return existing;
    }
    // Create a new placeholder
    const counter = (typeCounters.get(entityType) ?? 0) + 1;
    typeCounters.set(entityType, counter);
    const paddedId = counter.toString().padStart(8, "0");
    const placeholder = `__PII_${entityType}_${paddedId}__`;
    // Store both directions
    originalToPlaceholder.set(originalValue, placeholder);
    placeholderToOriginal.set(placeholder, originalValue);
    return placeholder;
}
/**
 * Get the original value for a placeholder
 */
export function getOriginalValue(placeholder) {
    return placeholderToOriginal.get(placeholder);
}
/**
 * Check if a string is a known placeholder
 */
export function isKnownPlaceholder(text) {
    return placeholderToOriginal.has(text);
}
/**
 * Get all placeholders and their original values as a MappingTable
 * This is used for restoration
 */
export function getGlobalMappingTable() {
    return new Map(placeholderToOriginal);
}
/**
 * Get current statistics
 */
export function getMappingStats() {
    const byType = {};
    for (const [type, count] of typeCounters.entries()) {
        byType[type] = count;
    }
    return {
        totalMappings: placeholderToOriginal.size,
        byType,
    };
}
/**
 * Clear all mappings (for testing or reset)
 */
export function clearMappings() {
    originalToPlaceholder.clear();
    placeholderToOriginal.clear();
    typeCounters.clear();
}
//# sourceMappingURL=mapping-store.js.map