import {getWorldsEndScores} from "../../controllers/worldsendscores";
import {searchWorldsEndSongs} from "../../controllers/worldsendsongs";
import {Command, CommandErrorKinds} from "../models";

export const wemybest: Command = {
    name: "wemybest",
    help: ["wemybest 曲名", "指定されたWorld's End曲のスコアを表示します。"],
    body: async (params, context) => {
        if (params.length < 1) {
            return {
                error: CommandErrorKinds.TOO_FEW_PARAMETERS
            };
        }

        if (params.length > 1) {
            return {
                error: CommandErrorKinds.TOO_MANY_PARAMETERS
            };
        }

        if (!context.playerId) {
            return {
                error: CommandErrorKinds.PLAYER_INFO_IS_MISSING
            };
        }

        const songs = await searchWorldsEndSongs(params[0]);

        if (songs.length === 0) {
            return ["曲が見つかりませんでした。"];
        }

        if (songs.length > 5) {
            return ["曲が絞り切れませんでした。より具体的な名前をお試しください。"];
        }

        if (songs.length > 1) {
            const choices = songs.map((song) => `${song.songName}\nwemybest /${song.songId}\n`);

            return [
                "曲が絞り切れませんでした。以下より該当の曲を選び、その真下のコマンドを入力してください。\n",
                ...choices
            ];
        }

        const scores = await getWorldsEndScores(context.playerId, {songId: songs[0].songId});

        return [
            `${songs[0].songName}: ${scores[0].score}`
        ];
    }
};
