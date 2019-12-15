import * as Express from "express";
import {setSingleScore} from "../../../controllers/scores";
import {decodeJWT} from "../../../helper/jwt";
import {Difficulty} from "../../../models/difficulty";

export default async function(req: Express.Request, res: Express.Response, next: Express.NextFunction): Promise<void> {
    const token: string = req.body.token;
    const songId: number = req.body.songId;
    const difficulty: Difficulty = req.body.difficulty;
    const score: number = req.body.score;

    if (
        typeof token !== "string"
        || typeof songId !== "number"
        || typeof difficulty !== "number"
        || typeof score !== "number"
    ) {
        res.status(400).json({});
        return;
    }

    try {
        const playerId = await decodeJWT(token);
        await setSingleScore(playerId, songId, difficulty, score);
        res.status(200).json({});
    } catch (err) {
        next(err);
    }
}
