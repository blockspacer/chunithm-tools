import * as Express from "express";
import {referenceRivalCode, removeRival} from "../../../controllers/rivals";
import {decodeJWT} from "../../../helper/jwt";

export default async function(req: Express.Request, res: Express.Response, next: Express.NextFunction): Promise<void> {
    const token: string = req.body.token;
    const rivalCode: string = req.body.rivalCode;

    if (
        typeof token !== "string"
        || typeof rivalCode !== "string"
    ) {
        res.status(400).json({});
        return;
    }

    try {
        const playerId = await decodeJWT(token);
        const rivalId = await referenceRivalCode(rivalCode);
        if (!rivalId || !(await removeRival(playerId, rivalId))) {
            res.status(200).json({status: "FAILED"});
            return;
        }
        res.status(200).json({status: "SUCCESS"});
    } catch (err) {
        next(err);
    }
}
