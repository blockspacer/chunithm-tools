import * as Express from "express";
import {issueRivalCode} from "../../../controllers/rivals";
import {decodeJWT} from "../../../helper/jwt";

export default async function(req: Express.Request, res: Express.Response, next: Express.NextFunction): Promise<void> {
    const token: string = req.body.token;

    if (
        typeof token !== "string"
    ) {
        res.status(400).json({});
        return;
    }

    try {
        const playerId = await decodeJWT(token);
        const rivalCode = await issueRivalCode(playerId);
        res.status(200).send(rivalCode);
    } catch (err) {
        next(err);
    }
}
