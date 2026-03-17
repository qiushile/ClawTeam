/**
 * Copyright (c) 2026 ByteDance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 *
 * Channel type definitions for the Feishu/Lark channel plugin.
 */
/** Result of probing an app's connectivity / permissions. */
export type FeishuProbeResult = {
    ok: boolean;
    error?: string;
    appId?: string;
    botName?: string;
    botOpenId?: string;
};
//# sourceMappingURL=types.d.ts.map