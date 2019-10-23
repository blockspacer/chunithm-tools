import * as Express from "express";
import {getPlayerId} from "../../../controllers/users";
import {ControllerError} from "../../../exceptions";

export default async function(req: Express.Request, res: Express.Response, next: Express.NextFunction): Promise<void> {
    const token: string = req.body.token;

    if (
        typeof token !== "string"
    ) {
        res.status(400).json({});
        return;
    }

    try {
        await getPlayerId(token);
        res.status(200).json({status: "SUCCESS"});
    } catch (err) {
        if (err instanceof ControllerError) {
            res.status(200).json({status: "FAILED"});
        } else {
            next(err);
        }
    }
}
