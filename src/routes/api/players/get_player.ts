import * as Express from "express";
import {getPlayer} from "../../../controllers/players";
import {ControllerError} from "../../../exceptions";
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
        const player = getPlayer(playerId);
        res.status(200).json({status: "SUCCESS", player});
    } catch (err) {
        if (err instanceof ControllerError) {
            res.status(200).json({status: "FAILED"});
        } else {
            next(err);
        }
    }
}
