import * as Express from "express";
import {getDifficulty} from "../../../controllers/difficulty";

export default async function(req: Express.Request, res: Express.Response, next: Express.NextFunction): Promise<void> {
    const songId: number = req.body.songId;
    const score: number = req.body.score;

    if (
        typeof songId !== "number"
        || typeof score !== "number"
    ) {
        res.status(400).json({});
        return;
    }

    try {
        const difficulty = await getDifficulty(songId, score);
        res.status(200).send(String(difficulty));
    } catch (err) {
        next(err);
    }
}
