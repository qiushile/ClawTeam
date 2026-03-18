/**
 * Copyright (c) 2026 ByteDance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 *
 * Task extraction and creation -- parse TODO items from agent output and
 * create tracked Feishu tasks via the Task v2 API using the Lark SDK client.
 */
import { LarkClient } from "../core/lark-client.js";
import { sendCardFeishu } from "../messaging/outbound/send.js";
// ---------------------------------------------------------------------------
// Date extraction helpers
// ---------------------------------------------------------------------------
const DAY_NAMES = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
};
/**
 * Attempt to extract a due date from a natural language string.
 *
 * Supported patterns:
 *  - ISO dates: `2026-03-01`
 *  - Relative weekdays: `by Friday`, `due Monday`
 *  - Relative days: `in 3 days`, `tomorrow`
 *
 * Returns an ISO-8601 date string (YYYY-MM-DD) or undefined.
 */
function extractDueDate(text) {
    // 1. Explicit ISO date  (e.g. "due 2026-03-01" or just "2026-03-01")
    const isoMatch = text.match(/(\d{4}-\d{2}-\d{2})/);
    if (isoMatch) {
        return isoMatch[1];
    }
    // 2. "tomorrow"
    if (/\btomorrow\b/i.test(text)) {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return formatDate(d);
    }
    // 3. "in N days"
    const inDaysMatch = text.match(/\bin\s+(\d+)\s+days?\b/i);
    if (inDaysMatch) {
        const d = new Date();
        d.setDate(d.getDate() + parseInt(inDaysMatch[1], 10));
        return formatDate(d);
    }
    // 4. "by <weekday>" or "due <weekday>"
    const byDayMatch = text.match(/\b(?:by|due|on)\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i);
    if (byDayMatch) {
        const targetDay = DAY_NAMES[byDayMatch[1].toLowerCase()];
        if (targetDay !== undefined) {
            const now = new Date();
            const currentDay = now.getDay();
            let diff = targetDay - currentDay;
            if (diff <= 0)
                diff += 7; // next occurrence
            now.setDate(now.getDate() + diff);
            return formatDate(now);
        }
    }
    return undefined;
}
/**
 * Attempt to extract an assignee mention from a todo line.
 *
 * Looks for `@username` patterns.
 */
function extractAssignee(text) {
    const match = text.match(/@(\w+)/);
    return match ? match[1] : undefined;
}
function formatDate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}
// ---------------------------------------------------------------------------
// Todo extraction
// ---------------------------------------------------------------------------
/**
 * Parse markdown checklists and TODO: lines from content.
 *
 * Recognized formats:
 *  - `- [ ] task text`
 *  - `- [x] completed task` (included but marked as completed)
 *  - `TODO: some task`
 *  - `TODO some task`
 */
export function extractTodos(content) {
    const todos = [];
    const lines = content.split("\n");
    for (const line of lines) {
        const trimmed = line.trim();
        // Markdown checklist: - [ ] or - [x]
        const checklistMatch = trimmed.match(/^-\s+\[[ x]\]\s+(.+)/i);
        if (checklistMatch) {
            const text = checklistMatch[1].trim();
            todos.push({
                text,
                dueDate: extractDueDate(text),
                assignee: extractAssignee(text),
            });
            continue;
        }
        // TODO: line  (with or without colon)
        const todoMatch = trimmed.match(/^TODO:?\s+(.+)/i);
        if (todoMatch) {
            const text = todoMatch[1].trim();
            todos.push({
                text,
                dueDate: extractDueDate(text),
                assignee: extractAssignee(text),
            });
        }
    }
    return todos;
}
// ---------------------------------------------------------------------------
// Feishu Task creation via Lark SDK
// ---------------------------------------------------------------------------
/**
 * Create a single Feishu task via the Task v2 API using the Lark SDK client.
 */
async function createFeishuTask(todo, client) {
    const body = {
        summary: todo.text,
    };
    // Attach due date if extracted
    if (todo.dueDate) {
        // The Task v2 API expects a Unix timestamp (seconds) for due.timestamp
        const dueTimestamp = Math.floor(new Date(todo.dueDate + "T23:59:59Z").getTime() / 1000);
        body.due = {
            timestamp: String(dueTimestamp),
            is_all_day: true,
        };
    }
    const res = await client.task.v2.task.create({ data: body });
    const task = res?.data?.task || res?.task;
    return {
        taskId: task.guid,
        title: task.summary,
        url: task.url || `https://feishu.cn/task/detail/${task.guid}`,
    };
}
/**
 * Create Feishu tasks for every extracted todo item and return their details.
 */
export async function createTrackedTasks(todos, context) {
    const client = LarkClient.fromCfg(context.cfg, context.accountId).sdk;
    const results = [];
    for (const todo of todos) {
        try {
            const task = await createFeishuTask(todo, client);
            results.push(task);
        }
        catch (err) {
            // Log but don't abort -- best-effort creation
            console.error(`[task-tracker] Failed to create task "${todo.text}":`, err);
        }
    }
    return results;
}
// ---------------------------------------------------------------------------
// Task summary card
// ---------------------------------------------------------------------------
/**
 * Build and send a summary card listing all created tasks.
 */
export async function sendTaskSummaryCard(chatId, tasks, cfg, accountId) {
    if (tasks.length === 0)
        return;
    const taskLines = tasks
        .map((t, i) => `${i + 1}. [${t.title}](${t.url})`)
        .join("\n");
    const card = {
        config: { wide_screen_mode: true },
        header: {
            title: {
                tag: "plain_text",
                content: `Created ${tasks.length} Task${tasks.length > 1 ? "s" : ""}`,
            },
            template: "green",
        },
        elements: [
            {
                tag: "markdown",
                content: taskLines,
            },
            {
                tag: "note",
                elements: [
                    {
                        tag: "plain_text",
                        content: "Tasks were automatically created from agent output.",
                    },
                ],
            },
        ],
    };
    await sendCardFeishu({ cfg, to: chatId, card, accountId });
}
//# sourceMappingURL=task-tracker.js.map