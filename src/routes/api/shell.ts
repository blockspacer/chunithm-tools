import * as Express from "express";
import {decodeJWT} from "../../helper/jwt";
import {executeCommand} from "../../shell";

export default async function(req: Express.Request, res: Express.Response, next: Express.NextFunction): Promise<void> {
    const token: string = req.body.token;
    const command: string = req.body.command;

    if (
        typeof command !== "string"
    ) {
        res.status(400).json({});
        return;
    }

    try {
        if (typeof token === "string") {
            const playerId = await decodeJWT(token);
            const result = await executeCommand(command, {playerId});
            res.status(200).json(result);
        } else {
            const result = await executeCommand(command, {});
            res.status(200).json(result);
        }
    } catch (err) {
        res.status(200).json([]);
        next(err);
    }
}
