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
import type { ClawdbotConfig } from "openclaw/plugin-sdk";
export interface ParsedTable {
    headers: string[];
    rows: string[][];
}
export interface BitableResult {
    url: string;
    appToken: string;
}
export interface DataSinkContext {
    chatId: string;
    cfg: ClawdbotConfig;
    accountId?: string;
    workspaceFolder?: string;
}
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
export declare function parseMarkdownTable(content: string): ParsedTable | null;
/**
 * Create a new Bitable app, add a table with the supplied headers as fields,
 * insert all rows as records, and return the app URL.
 */
export declare function writeToFeishuBitable(data: ParsedTable, context: DataSinkContext): Promise<BitableResult>;
/**
 * Send an interactive card to `chatId` with a Bitable link and a short
 * data preview.
 */
export declare function sendBitableCard(chatId: string, bitableUrl: string, preview: string, cfg: ClawdbotConfig, accountId?: string): Promise<void>;
//# sourceMappingURL=data-sink.d.ts.map