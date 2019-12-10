import * as Express from "express";
import {setDifference, setScores} from "../../../controllers/scores";
import {decodeJWT} from "../../../helper/jwt";
import {ScoreList, validateScoreList} from "../../../models/score_list";

export default async function(req: Express.Request, res: Express.Response, next: Express.NextFunction): Promise<void> {
    const token: string = req.body.token;
    const scores: ScoreList = req.body.scores;

    if (
        typeof token !== "string"
        || !validateScoreList(scores)
    ) {
        res.status(400).json({});
        return;
    }

    try {
        const playerId = await decodeJWT(token);
        await setScores(playerId, scores);
        await setDifference(playerId, scores);
        res.status(200).json({});
    } catch (err) {
        next(err);
    }
}
