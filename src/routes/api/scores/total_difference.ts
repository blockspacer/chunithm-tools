import * as Express from "express";
import {getDifference, getScores} from "../../../controllers/scores";
import {decodeJWT} from "../../../helper/jwt";
import { TotalDifference } from "../../../models/total_difference";

export default async function(req: Express.Request, res: Express.Response, next: Express.NextFunction): Promise<void> {
    const token: string = req.body.token;

    if (
        typeof token !== "string"
    ) {
        res.status(400).json({});
        return;
    }

    try {
        const playerId = await decodeJWT(token);
        const differences = await getDifference(playerId);
        const scores = await getScores(playerId, {});
        const difference = differences.reduce<TotalDifference[]>((acc, x) => {
                acc[x.song.difficulty].oldScore -= x.newScore - x.oldScore;
                return acc;
            },
            scores.reduce<number[]>((acc, x) => {
                acc[x.song.difficulty] += x.score;
                return acc;
            }, [0, 0, 0, 0])
                .map<TotalDifference>((x) =>  ({oldScore: x, newScore: x})));
        res.status(200).json(difference);
    } catch (err) {
        next(err);
    }
}
