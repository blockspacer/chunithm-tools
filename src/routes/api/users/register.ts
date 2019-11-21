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

    if (
        !/^[a-zA-Z0-9]+$/u.test(userId)
        || !/^[\x20-\x7e]+$/u.test(password)
    ) {
        res.status(200).json({status: "FAILED"});
        return;
    }

    const playerId = sha256(userId);

    try {
        await create(userId, password, playerId);
        res.status(200).json({status: "SUCCESS"});
    } catch (err) {
        if (err instanceof ControllerError) {
            res.status(200).json({status: "FAILED"});
        } else {
            next(err);
        }
    }
}
