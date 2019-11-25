import * as Express from "express";
import {setWorldsEndScores} from "../../../../controllers/worldsendscores";
import {decodeJWT} from "../../../../helper/jwt";
import {validateWorldsEndScoreList, WorldsEndScoreList} from "../../../../models/worldsendscore_list";

export default async function(req: Express.Request, res: Express.Response, next: Express.NextFunction): Promise<void> {
    const token: string = req.body.token;
    const scores: WorldsEndScoreList = req.body.scores;

    if (
        typeof token !== "string"
        || Array.isArray(scores)
        || validateWorldsEndScoreList(scores)
    ) {
        res.status(400).json({});
        return;
    }

    try {
        const playerId = await decodeJWT(token);
        await setWorldsEndScores(playerId, scores);
        res.status(200).json({});
    } catch (err) {
        next(err);
    }
}
