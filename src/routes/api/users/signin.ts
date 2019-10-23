import * as Express from "express";
import {signIn} from "../../../controllers/users";
import {ControllerError} from "../../../exceptions";

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

    try {
        const token = await signIn(userId, password);
        res.status(200).json({status: "SUCCESS", token});
    } catch (err) {
        if (err instanceof ControllerError) {
            res.status(200).json({status: "FAILED"});
        } else {
            next(err);
        }
    }
}
