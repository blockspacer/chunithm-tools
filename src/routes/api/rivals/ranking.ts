import * as Express from "express";
import {rivalRanking} from "../../../controllers/rivals";
import {decodeJWT} from "../../../helper/jwt";
import {Difficulty} from "../../../models/difficulty";

export default async function(req: Express.Request, res: Express.Response, next: Express.NextFunction): Promise<void> {
    const token: string = req.body.token;
    const songId: number = req.body.songId;
    const difficulty: Difficulty = req.body.difficulty;

    if (
        typeof token !== "string"
        || typeof songId !== "number"
        || typeof difficulty !== "number"
    ) {
        res.status(400).json({});
        return;
    }

    try {
        const playerId = await decodeJWT(token);
        const ranking = await rivalRanking(playerId, songId, difficulty);
        res.status(200).json(ranking);
    } catch (err) {
        next(err);
    }
}
