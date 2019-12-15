import {getPlayer} from "../../controllers/players";
import {getBestSongs} from "../../controllers/scores";
import {ControllerError} from "../../exceptions";
import {integerToEmblem, integerToRate} from "../../helper/formatter";
import {Command, CommandErrorKinds} from "../models";

export const profile: Command = {
    name: "profile",
    help: ["profile", "プレイヤーのプロフィールを表示します。"],
    body: async (params, context) => {
        if (params.length > 0) {
            return {
                error: CommandErrorKinds.TOO_MANY_PARAMETERS
            };
        }

        if (!context.playerId) {
            return {
                error: CommandErrorKinds.PLAYER_INFO_IS_MISSING
            };
        }

        try {
            const player = await getPlayer(context.playerId);
            const best = await getBestSongs(context.playerId);
            const bestAverage = best.slice(0, 30).reduce<number>((acc, score) => acc + score.rate, 0) / 30;

            return [
                player.playerName,
                `RATE: ${integerToRate(player.currentRate)} / ${integerToRate(player.maxRate)}`,
                `BEST: ${(bestAverage / 100).toFixed(4)}`,
                `RECENT: ${((player.currentRate * 4 - bestAverage * 3) / 100).toFixed(4)}`,
                `EMBLEM: ${integerToEmblem(player.emblemTop)}${player.emblemBase ? ` (${integerToEmblem(player.emblemBase)}-belt)` : ""}`
            ];
        } catch (err) {
            if (err instanceof ControllerError) {
                return ["プレイヤー情報が見つかりませんでした。"];
            }

            throw err;
        }
    }
};
