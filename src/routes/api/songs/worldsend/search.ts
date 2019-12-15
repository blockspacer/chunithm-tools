import * as Express from "express";
import {searchWorldsEndSongs} from "../../../../controllers/worldsendsongs";

export default async function(req: Express.Request, res: Express.Response, next: Express.NextFunction): Promise<void> {
    const query: string = req.body.query;

    if (
        typeof query !== "string"
    ) {
        res.status(400).json({});
        return;
    }

    try {
        const songs = await searchWorldsEndSongs(query);
        res.status(200).json(songs);
    } catch (err) {
        next(err);
    }
}
