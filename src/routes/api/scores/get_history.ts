import * as Express from "express";
import {getHistories} from "../../../controllers/scores";
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
        const scores = await getHistories(playerId, 50);
        res.status(200).json(scores);
    } catch (err) {
        next(err);
    }
}
