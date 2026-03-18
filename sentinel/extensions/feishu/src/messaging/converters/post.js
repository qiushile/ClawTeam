/**
 * Copyright (c) 2026 ByteDance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 *
 * Converter for "post" (rich text) message type.
 *
 * Preserves structure as Markdown: links as `[text](href)`,
 * images as `![image](key)`, code blocks, and mention resolution.
 */
import { resolveMentions } from "./content-converter.js";
import { safeParse } from "./utils.js";
export const convertPost = (raw, ctx) => {
    const parsed = safeParse(raw);
    if (!parsed) {
        return { content: "[rich text message]", resources: [] };
    }
    const resources = [];
    const lines = [];
    // Title
    if (parsed.title) {
        lines.push(`**${parsed.title}**`, "");
    }
    const contentBlocks = parsed.content ?? [];
    for (const paragraph of contentBlocks) {
        if (!Array.isArray(paragraph))
            continue;
        let line = "";
        for (const el of paragraph) {
            line += renderElement(el, ctx, resources);
        }
        lines.push(line);
    }
    let content = lines.join("\n").trim() || "[rich text message]";
    content = resolveMentions(content, ctx);
    return { content, resources };
};
function renderElement(el, ctx, resources) {
    switch (el.tag) {
        case "text": {
            let text = el.text ?? "";
            text = applyStyle(text, el.style);
            return text;
        }
        case "a": {
            const text = el.text ?? el.href ?? "";
            return el.href ? `[${text}](${el.href})` : text;
        }
        case "at": {
            // At-mention in post — use placeholder key if available via context,
            // otherwise fall back to @user_name.
            const userId = el.user_id ?? "";
            if (userId === "all")
                return "@all";
            const name = el.user_name ?? userId;
            // O(1) lookup via reverse map
            const info = ctx.mentionsByOpenId.get(userId);
            if (info) {
                // Let resolveMentions handle it — return the placeholder key
                return info.key;
            }
            return `@${name}`;
        }
        case "img": {
            if (el.image_key) {
                resources.push({ type: "image", fileKey: el.image_key });
                return `![image](${el.image_key})`;
            }
            return "";
        }
        case "media": {
            if (el.file_key) {
                resources.push({ type: "file", fileKey: el.file_key });
                return `<file key="${el.file_key}"/>`;
            }
            return "";
        }
        case "code_block": {
            const lang = el.language ?? "";
            const code = el.text ?? "";
            return `\n\`\`\`${lang}\n${code}\n\`\`\`\n`;
        }
        case "hr":
            return "\n---\n";
        default:
            return el.text ?? "";
    }
}
function applyStyle(text, style) {
    if (!style || style.length === 0)
        return text;
    let result = text;
    if (style.includes("bold"))
        result = `**${result}**`;
    if (style.includes("italic"))
        result = `*${result}*`;
    if (style.includes("underline"))
        result = `<u>${result}</u>`;
    if (style.includes("lineThrough"))
        result = `~~${result}~~`;
    if (style.includes("codeInline"))
        result = `\`${result}\``;
    return result;
}
//# sourceMappingURL=post.js.map