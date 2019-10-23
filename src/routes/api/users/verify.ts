import * as Express from "express";
import {getPlayerId} from "../../../controllers/users";

export default async function(req: Express.Request, res: Express.Response): Promise<void> {
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
    } catch {
        res.status(200).json({status: "FAILED"});
    }
}
