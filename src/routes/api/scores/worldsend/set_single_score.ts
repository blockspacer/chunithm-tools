import * as Express from "express";
import {setSingleWorldsEndScore} from "../../../../controllers/worldsendscores";
import {decodeJWT} from "../../../../helper/jwt";

export default async function(req: Express.Request, res: Express.Response, next: Express.NextFunction): Promise<void> {
    const token: string = req.body.token;
    const songId: number = req.body.songId;
    const score: number = req.body.score;

    if (
        typeof token !== "string"
        || typeof songId !== "number"
        || typeof score !== "number"
    ) {
        res.status(400).json({});
        return;
    }

    try {
        const playerId = await decodeJWT(token);
        await setSingleWorldsEndScore(playerId, songId, score);
        res.status(200).json({});
    } catch (err) {
        next(err);
    }
}
