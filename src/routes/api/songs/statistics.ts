import * as Express from "express";
import {statistics} from "../../../controllers/difficulty";
import {getBorderedScoreCount} from "../../../controllers/scores";

export default async function(req: Express.Request, res: Express.Response, next: Express.NextFunction): Promise<void> {
    const songId: number = req.body.songId;

    if (typeof songId !== "number") {
        res.status(400).json({});
        return;
    }

    try {
        const count = await getBorderedScoreCount(songId, [1007500, 1005000, 1000000, 975000, 1]);
        const stat = await statistics(songId);
        res.status(200).json({count, stat});
    } catch (err) {
        next(err);
    }
}
