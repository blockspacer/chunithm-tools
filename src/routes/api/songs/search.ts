import * as Express from "express";
import {searchSongs} from "../../../controllers/songs";

export default async function(req: Express.Request, res: Express.Response): Promise<void> {
    const query: string = req.body.query;

    if (
        typeof query !== "string"
    ) {
        res.status(400).json({});
        return;
    }

    try {
        const songs = await searchSongs(query);
        res.status(200).json({status: "SUCCESS", songs});
    } catch {
        res.status(200).json({status: "FAILED"});
    }
}
