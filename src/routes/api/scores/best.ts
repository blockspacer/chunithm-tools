import * as Express from "express";
import {getBestSongs} from "../../../controllers/scores";
import {decodeJWT} from "../../../helper/jwt";

export default async function(req: Express.Request, res: Express.Response, next: Express.NextFunction): Promise<void> {
    const token: string = req.body.token;
    const count: number = req.body.count || 30;

    if (
        typeof token !== "string"
    ) {
        res.status(400).json({});
        return;
    }

    try {
        const playerId = await decodeJWT(token);
        const best = (await getBestSongs(playerId)).slice(0, Number(count));
        res.status(200).json(best);
    } catch (err) {
        next(err);
    }
}
