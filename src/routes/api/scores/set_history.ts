import * as Express from "express";
import {setHistories} from "../../../controllers/scores";
import {decodeJWT} from "../../../helper/jwt";
import {HistoryList, validateHistoryList} from "../../../models/history_list";

export default async function(req: Express.Request, res: Express.Response, next: Express.NextFunction): Promise<void> {
    const token: string = req.body.token;
    const history: HistoryList = req.body.history;

    if (
        typeof token !== "string"
        || !validateHistoryList(history)
    ) {
        res.status(400).json({});
        return;
    }

    try {
        const playerId = await decodeJWT(token);
        await setHistories(playerId, history);
        res.status(200).json({});
    } catch (err) {
        next(err);
    }
}
