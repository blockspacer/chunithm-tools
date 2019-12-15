import * as Express from "express";
import {getDisplayName} from "../../../controllers/twitter";
import {decodeJWT} from "../../../helper/jwt";

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
        const displayName = await getDisplayName(playerId);
        res.status(200).send(displayName);
    } catch (err) {
        next(err);
    }
}
