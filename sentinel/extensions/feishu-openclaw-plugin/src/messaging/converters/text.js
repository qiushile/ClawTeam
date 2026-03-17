/**
 * Copyright (c) 2026 ByteDance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 *
 * Converter for "text" message type.
 */
import { resolveMentions } from "./content-converter.js";
import { safeParse } from "./utils.js";
export const convertText = (raw, ctx) => {
    const parsed = safeParse(raw);
    const text = parsed?.text ?? raw;
    const content = resolveMentions(text, ctx);
    return { content, resources: [] };
};
//# sourceMappingURL=text.js.map