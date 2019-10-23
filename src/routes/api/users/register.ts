import * as Express from "express";
import {create} from "../../../controllers/users";
import {ControllerError} from "../../../exceptions";
import {sha256} from "../../../helper/hash";

export default async function(req: Express.Request, res: Express.Response, next: Express.NextFunction): Promise<void> {
    const userId: string = req.body.userId;
    const password: string = req.body.password;

    if (
        typeof userId !== "string" ||
        typeof password !== "string"
    ) {
        res.status(400).json({});
        return;
    }

    const playerId = sha256(userId);

    try {
        await create(playerId, userId, password);
        res.status(200).json({status: "SUCCESS"});
    } catch (err) {
        if (err instanceof ControllerError) {
            res.status(200).json({status: "FAILED"});
        } else {
            next(err);
        }
    }
}
