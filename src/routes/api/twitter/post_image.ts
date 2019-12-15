import * as Express from "express";
import {postToTwitter} from "../../../controllers/twitter";
import {decodeJWT} from "../../../helper/jwt";

export default async function(req: Express.Request, res: Express.Response, next: Express.NextFunction): Promise<void> {
    const token: string = req.body.token;
    const text: string = req.body.text;
    const image: string = req.body.image;

    if (
        typeof token !== "string"
        || typeof text !== "string"
        || typeof image !== "string"
    ) {
        res.status(400).json({});
        return;
    }

    try {
        const playerId = await decodeJWT(token);
        await postToTwitter(playerId, text, image);
        res.status(200).send("");
    } catch (err) {
        next(err);
    }
}
