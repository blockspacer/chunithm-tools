import * as Express from "express";
import {setPlayerId} from "../../../controllers/twitter";
import {decodeJWT} from "../../../helper/jwt";

export default async function(req: Express.Request, res: Express.Response, next: Express.NextFunction): Promise<void> {
    const token: string = req.body.token;
    const twitterToken: string = req.body.twitterToken;

    if (
        typeof token !== "string"
        || typeof twitterToken !== "string"
    ) {
        res.status(400).json({});
        return;
    }

    try {
        const playerId = await decodeJWT(token);
        await setPlayerId(twitterToken, playerId);
        res.status(200).json({});
    } catch (err) {
        next(err);
    }
}
