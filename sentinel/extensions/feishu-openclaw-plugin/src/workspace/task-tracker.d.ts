/**
 * Copyright (c) 2026 ByteDance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 *
 * Task extraction and creation -- parse TODO items from agent output and
 * create tracked Feishu tasks via the Task v2 API using the Lark SDK client.
 */
import type { ClawdbotConfig } from "openclaw/plugin-sdk";
export interface TodoItem {
    text: string;
    dueDate?: string;
    assignee?: string;
}
export interface CreatedTask {
    taskId: string;
    title: string;
    url: string;
}
/**
 * Parse markdown checklists and TODO: lines from content.
 *
 * Recognized formats:
 *  - `- [ ] task text`
 *  - `- [x] completed task` (included but marked as completed)
 *  - `TODO: some task`
 *  - `TODO some task`
 */
export declare function extractTodos(content: string): TodoItem[];
/**
 * Create Feishu tasks for every extracted todo item and return their details.
 */
export declare function createTrackedTasks(todos: TodoItem[], context: {
    cfg: ClawdbotConfig;
    chatId: string;
    accountId?: string;
}): Promise<CreatedTask[]>;
/**
 * Build and send a summary card listing all created tasks.
 */
export declare function sendTaskSummaryCard(chatId: string, tasks: CreatedTask[], cfg: ClawdbotConfig, accountId?: string): Promise<void>;
//# sourceMappingURL=task-tracker.d.ts.map