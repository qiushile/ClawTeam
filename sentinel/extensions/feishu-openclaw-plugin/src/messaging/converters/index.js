/**
 * Copyright (c) 2026 ByteDance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 *
 * Content converter mapping for all Feishu message types.
 */
import { convertText } from "./text.js";
import { convertPost } from "./post.js";
import { convertImage } from "./image.js";
import { convertFile } from "./file.js";
import { convertAudio } from "./audio.js";
import { convertVideo } from "./video.js";
import { convertSticker } from "./sticker.js";
import { convertInteractive } from "./interactive.js";
import { convertShareChat, convertShareUser } from "./share.js";
import { convertLocation } from "./location.js";
import { convertMergeForward } from "./merge-forward.js";
import { convertFolder } from "./folder.js";
import { convertSystem } from "./system.js";
import { convertHongbao } from "./hongbao.js";
import { convertShareCalendarEvent, convertCalendar, convertGeneralCalendar, } from "./calendar.js";
import { convertVideoChat } from "./video-chat.js";
import { convertTodo } from "./todo.js";
import { convertVote } from "./vote.js";
import { convertUnknown } from "./unknown.js";
export const converters = new Map([
    ["text", convertText],
    ["post", convertPost],
    ["image", convertImage],
    ["file", convertFile],
    ["audio", convertAudio],
    ["video", convertVideo],
    ["media", convertVideo],
    ["sticker", convertSticker],
    ["interactive", convertInteractive],
    ["share_chat", convertShareChat],
    ["share_user", convertShareUser],
    ["location", convertLocation],
    ["merge_forward", convertMergeForward],
    ["folder", convertFolder],
    ["system", convertSystem],
    ["hongbao", convertHongbao],
    ["share_calendar_event", convertShareCalendarEvent],
    ["calendar", convertCalendar],
    ["general_calendar", convertGeneralCalendar],
    ["video_chat", convertVideoChat],
    ["todo", convertTodo],
    ["vote", convertVote],
    ["unknown", convertUnknown],
]);
//# sourceMappingURL=index.js.map