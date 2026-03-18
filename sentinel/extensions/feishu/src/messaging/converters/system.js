/**
 * Copyright (c) 2026 ByteDance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 *
 * Converter for "system" message type.
 *
 * System messages use a template string with placeholders like
 * `{from_user}`, `{to_chatters}`, `{divider_text}` that are replaced
 * with actual values from the message body.
 */
import { safeParse } from "./utils.js";
export const convertSystem = (raw) => {
    const parsed = safeParse(raw);
    if (!parsed?.template) {
        return { content: "[system message]", resources: [] };
    }
    let content = parsed.template;
    // Replace {from_user} with comma-joined names
    if (parsed.from_user?.length) {
        content = content.replace("{from_user}", parsed.from_user.filter(Boolean).join(", "));
    }
    // Replace {to_chatters} with comma-joined names
    if (parsed.to_chatters?.length) {
        content = content.replace("{to_chatters}", parsed.to_chatters.filter(Boolean).join(", "));
    }
    // Replace {divider_text} with divider text content
    if (parsed.divider_text?.text) {
        content = content.replace("{divider_text}", parsed.divider_text.text);
    }
    // Clean up any remaining unreplaced placeholders
    content = content.replace(/\{[^}]+\}/g, "");
    return { content: content.trim(), resources: [] };
};
//# sourceMappingURL=system.js.map