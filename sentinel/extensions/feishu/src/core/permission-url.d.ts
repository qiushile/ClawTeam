/**
 * Copyright (c) 2026 ByteDance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 *
 * Permission URL extraction utilities.
 *
 * Shared functions for extracting and processing permission grant URLs
 * from Feishu API error messages.
 */
/**
 * Permission priority for sorting.
 * Lower number = higher priority.
 * - read: 1 (highest)
 * - write: 2
 * - other / both read+write: 3 (lowest)
 */
export declare function getPermissionPriority(scope: string): number;
/**
 * Extract the highest-priority permission from a scope list.
 * Returns the permission with the lowest priority number (read > write > other).
 */
export declare function extractHighestPriorityScope(scopeList: string): string;
/**
 * Extract permission grant URL from a Feishu error message and optimize it
 * by keeping only the highest-priority permission.
 *
 * @param msg - The error message containing the grant URL
 * @returns The optimized grant URL with single permission, or empty string if not found
 */
export declare function extractPermissionGrantUrl(msg: string): string;
/**
 * Extract permission scopes from a Feishu error message.
 * Looks for scopes in the format [scope1,scope2,...]
 */
export declare function extractPermissionScopes(msg: string): string;
//# sourceMappingURL=permission-url.d.ts.map