/**
 * Copyright (c) 2026 ByteDance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 *
 * Sender name resolution for Feishu messages.
 *
 * Thin wrapper around the account-scoped {@link resolveUserName} from
 * `user-name-cache.ts`. All caching and API logic lives there.
 */
import { resolveUserName } from "./user-name-cache.js";
// ---------------------------------------------------------------------------
// Sender name resolution
// ---------------------------------------------------------------------------
export async function resolveSenderName(params) {
    const { account, senderOpenId, log } = params;
    return resolveUserName({ account, openId: senderOpenId, log });
}
//# sourceMappingURL=sender.js.map