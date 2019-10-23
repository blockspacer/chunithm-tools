import * as Express from "express";
import {setPlayer} from "../../../controllers/players";
import {decodeJWT} from "../../../helper/jwt";
import {Player, validatePlayer} from "../../../models/player";

export default async function(req: Express.Request, res: Express.Response, next: Express.NextFunction): Promise<void> {
    const token: string = req.body.token;
    const player: Player = req.body.player;

    if (
        typeof token !== "string"
        && validatePlayer(player)
    ) {
        res.status(400).json({});
        return;
    }

    try {
        const playerId = await decodeJWT(token);
        setPlayer(
            playerId,
            player.playerName,
            player.currentRate,
            player.maxRate,
            player.title,
            player.emblemTop,
            player.emblemBase
        );
        res.status(200).json({status: "SUCCESS"});
    } catch (err) {
        next(err);
    }
}
