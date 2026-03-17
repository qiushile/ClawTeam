/**
 * Copyright (c) 2026 ByteDance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 *
 * Data sink -- route structured / tabular data to Feishu Bitable.
 *
 * Parses markdown tables from agent output, creates a Bitable app with
 * matching fields, inserts the records, and sends an interactive card
 * with a preview and link back to the chat.
 *
 * Adapted to use the Lark SDK client instead of raw fetch + TAT auth.
 */
import { LarkClient } from "../core/lark-client.js";
import { sendCardFeishu } from "../messaging/outbound/send.js";
// ---------------------------------------------------------------------------
// Markdown table parser
// ---------------------------------------------------------------------------
/**
 * Parse the first markdown table found in `content`.
 *
 * A valid markdown table has:
 *  - A header row:  `| Col A | Col B |`
 *  - A separator:   `| --- | --- |` (at least three dashes per column)
 *  - One or more data rows
 *
 * Returns `{ headers, rows }` or `null` if no table is found.
 */
export function parseMarkdownTable(content) {
    const lines = content.split("\n").map((l) => l.trim());
    let headerIndex = -1;
    // Find the separator row to locate the table
    for (let i = 1; i < lines.length; i++) {
        if (isSeparatorRow(lines[i])) {
            headerIndex = i - 1;
            break;
        }
    }
    if (headerIndex < 0)
        return null;
    const headers = parsePipedRow(lines[headerIndex]);
    if (headers.length === 0)
        return null;
    // Collect data rows after the separator
    const separatorIndex = headerIndex + 1;
    const rows = [];
    for (let i = separatorIndex + 1; i < lines.length; i++) {
        const line = lines[i];
        // Stop when we leave the table (empty line or non-pipe line)
        if (!line.startsWith("|") && !line.includes("|"))
            break;
        const cells = parsePipedRow(line);
        if (cells.length === 0)
            break;
        // Pad or trim to match header count
        const normalized = headers.map((_, ci) => ci < cells.length ? cells[ci] : "");
        rows.push(normalized);
    }
    if (rows.length === 0)
        return null;
    return { headers, rows };
}
/**
 * Check if a line is a markdown table separator row.
 * e.g. `| --- | :---: | ---: |`
 */
function isSeparatorRow(line) {
    if (!line.includes("|"))
        return false;
    const cells = parsePipedRow(line);
    return cells.length > 0 && cells.every((c) => /^:?-{3,}:?$/.test(c));
}
/**
 * Split a pipe-delimited row into trimmed cell values.
 * Handles leading/trailing pipes gracefully.
 */
function parsePipedRow(line) {
    // Remove leading and trailing pipe
    let cleaned = line.trim();
    if (cleaned.startsWith("|"))
        cleaned = cleaned.slice(1);
    if (cleaned.endsWith("|"))
        cleaned = cleaned.slice(0, -1);
    if (cleaned.length === 0)
        return [];
    return cleaned.split("|").map((c) => c.trim());
}
// ---------------------------------------------------------------------------
// Bitable creation via Lark SDK
// ---------------------------------------------------------------------------
/**
 * Create a new Bitable app, add a table with the supplied headers as fields,
 * insert all rows as records, and return the app URL.
 */
export async function writeToFeishuBitable(data, context) {
    const client = LarkClient.fromCfg(context.cfg, context.accountId).sdk;
    // 1. Create a Bitable app ------------------------------------------------
    const appRes = await client.bitable.v1.app.create({
        data: {
            name: "Agent Data Output",
            ...(context.workspaceFolder
                ? { folder_token: context.workspaceFolder }
                : {}),
        },
    });
    const appToken = appRes?.data?.app?.app_token;
    const appUrl = appRes?.data?.app?.url || `https://feishu.cn/base/${appToken}`;
    // 2. Retrieve the default table that is created with the app --------------
    const tablesRes = await client.bitable.v1.appTable.list({
        path: { app_token: appToken },
    });
    const tableId = tablesRes?.data?.items?.[0]?.table_id;
    // 3. Create fields matching the provided headers --------------------------
    //    The default table usually comes with a single text field. We add all
    //    headers as text fields and will use them by name when inserting records.
    for (const header of data.headers) {
        try {
            await client.bitable.v1.appTableField.create({
                path: { app_token: appToken, table_id: tableId },
                data: {
                    field_name: header,
                    type: 1, // 1 = Text
                },
            });
        }
        catch {
            // Ignoring errors for duplicate field names -- the default field might
            // already share a name with one of our headers.
        }
    }
    // 4. Insert rows as records -----------------------------------------------
    //    The batch-create endpoint accepts up to 500 records at a time.
    const BATCH_SIZE = 500;
    for (let offset = 0; offset < data.rows.length; offset += BATCH_SIZE) {
        const batch = data.rows.slice(offset, offset + BATCH_SIZE);
        const records = batch.map((row) => {
            const fields = {};
            data.headers.forEach((h, i) => {
                fields[h] = row[i] ?? "";
            });
            return { fields };
        });
        try {
            await client.bitable.v1.appTableRecord.batchCreate({
                path: { app_token: appToken, table_id: tableId },
                data: { records },
            });
        }
        catch (err) {
            console.error(`[data-sink] Batch insert failed (offset=${offset}):`, err);
        }
    }
    return { url: appUrl, appToken };
}
// ---------------------------------------------------------------------------
// Bitable interactive card
// ---------------------------------------------------------------------------
/**
 * Send an interactive card to `chatId` with a Bitable link and a short
 * data preview.
 */
export async function sendBitableCard(chatId, bitableUrl, preview, cfg, accountId) {
    const card = {
        config: { wide_screen_mode: true },
        header: {
            title: { tag: "plain_text", content: "Data Written to Bitable" },
            template: "purple",
        },
        elements: [
            {
                tag: "markdown",
                content: `**Preview:**\n\`\`\`\n${preview}\n\`\`\``,
            },
            {
                tag: "action",
                actions: [
                    {
                        tag: "button",
                        text: { tag: "plain_text", content: "Open Bitable" },
                        type: "primary",
                        url: bitableUrl,
                    },
                ],
            },
        ],
    };
    await sendCardFeishu({ cfg, to: chatId, card, accountId });
}
//# sourceMappingURL=data-sink.js.map