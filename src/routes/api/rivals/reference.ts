import * as Express from "express";
import {getPlayer} from "../../../controllers/players";
import {referenceRivalCode} from "../../../controllers/rivals";

export default async function(req: Express.Request, res: Express.Response, next: Express.NextFunction): Promise<void> {
    const rivalCode: string = req.body.rivalCode;

    if (
        typeof rivalCode !== "string"
    ) {
        res.status(400).json({});
        return;
    }

    try {
        const rivalId = await referenceRivalCode(rivalCode);
        if (!rivalId) {
            res.status(200).json({});
            return;
        }
        const player = await getPlayer(rivalId);
        res.status(200).json(player);
    } catch (err) {
        next(err);
    }
}
