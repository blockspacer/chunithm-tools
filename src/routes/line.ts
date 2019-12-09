import {createHmac} from "crypto";
import * as Express from "express";
import * as request from "request";
import {getConfig} from "../config";
import {executeCommand} from "../shell";
import {Context} from "../shell/models";

function reply(token: string, message: string): void {
    if (message === "") {
        return;
    }
    const config = getConfig();
    request.post("https://api.line.me/v2/bot/message/reply", {
        headers: {
            "Content-Type": "application/json; charser=UTF-8",
            "Authorization": "Bearer " + config.line.accessToken
        },
        json: {
            replyToken: token,
            messages: [{
                type: "text",
                text: message
            }]
        }
    });
}

function hmac(content: string) {
    const config = getConfig();
    return createHmac("sha256", String(config.line.secret)).update(String(content)).digest("base64");
}

function hexHmac(content: string) {
    const config = getConfig();
    return createHmac("sha256", String(config.line.secret)).update(String(content)).digest("hex");
}

async function processMessage(message: any): Promise<void> {
    const type: string = message.type;
    if (type === "join") {
        reply(message.replyToken, "グループへの招待ありがとうございます。helpと送信すると使い方を表示します。");
        return;
    }
    if (type !== "message" || message.message.type !== "text") {
        return;
    }

    const context: Context = {};
    if (typeof message.source.userId === "string") {
        context.playerId = hexHmac(message.source.userId);
    }
    if (typeof message.source.groupId === "string") {
        context.groupId = hexHmac(message.source.groupId);
    } else if (typeof message.source.roomId === "string") {
        context.groupId = hexHmac(message.source.roomId);
    }

    const result = (await executeCommand(message.message.text, context)).join("\n");
    reply(message.replyToken, result);
}

export default async function(req: Express.Request, res: Express.Response): Promise<void> {
    const xLineSignature = req.get("X-Line-Signature");
    const body = JSON.stringify(req.body);
    if (typeof body !== "string" || typeof xLineSignature !== "string") {
        res.status(200).send("");
        return;
    }
    const signature = hmac(body);

    if (xLineSignature !== signature) {
        res.status(200).send("");
        return;
    }

    const events: any = JSON.parse(body);

    for (const message of events.events) {
        processMessage(message);
    }

    res.status(200).send("");
}
