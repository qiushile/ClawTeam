/**
 * Copyright (c) 2026 ByteDance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 *
 * Sender name resolution for Feishu messages.
 *
 * Thin wrapper around the account-scoped {@link resolveUserName} from
 * `user-name-cache.ts`. All caching and API logic lives there.
 */
import type { LarkAccount } from "../../core/types.js";
import { type ResolveUserNameResult } from "./user-name-cache.js";
export type SenderNameResult = ResolveUserNameResult;
export declare function resolveSenderName(params: {
    account: LarkAccount;
    senderOpenId: string;
    log: (...args: unknown[]) => void;
}): Promise<SenderNameResult>;
//# sourceMappingURL=sender.d.ts.map