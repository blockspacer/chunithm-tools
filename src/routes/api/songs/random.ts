import * as Express from "express";
import {randomSongs} from "../../../controllers/songs";

export default async function(req: Express.Request, res: Express.Response, next: Express.NextFunction): Promise<void> {
    const minRateValue: number = req.body.minRateValue;
    const maxRateValue: number = req.body.maxRateValue;
    const count: number = req.body.count;

    if (
        typeof minRateValue !== "number"
        || typeof maxRateValue !== "number"
        || typeof count !== "number"
    ) {
        res.status(400).json({});
        return;
    }

    try {
        const songs = await randomSongs(minRateValue, maxRateValue, count);
        res.status(200).json(songs);
    } catch (err) {
        next(err);
    }
}
