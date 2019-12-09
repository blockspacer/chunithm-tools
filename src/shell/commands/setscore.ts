import {setSingleScore} from "../../controllers/scores";
import {searchSongs} from "../../controllers/songs";
import {difficultyNameToInteger, integerToDifficulty, scoreToInteger} from "../../helper/formatter";
import {Difficulty} from "../../models/difficulty";
import {Command, CommandErrorKinds} from "../models";

export const setscore: Command = {
    name: "setscore",
    help: ["setscore 曲名, [難易度,] スコア", "指定された曲にスコアを登録します。"],
    body: async (params, context) => {
        if (params.length < 2) {
            return {
                error: CommandErrorKinds.TOO_FEW_PARAMETERS
            };
        }

        if (params.length > 3) {
            return {
                error: CommandErrorKinds.TOO_MANY_PARAMETERS
            };
        }

        if (!context.playerId) {
            return {
                error: CommandErrorKinds.PLAYER_INFO_IS_MISSING
            };
        }

        const songs = await searchSongs(params[0]);
        const difficulty = params.length === 3
                           ? difficultyNameToInteger(params[1])
                           : Difficulty.MASTER;
        const score = scoreToInteger(params[params.length - 1]);

        if (songs.length === 0) {
            return ["曲が見つかりませんでした。"];
        }

        if (songs.length > 5) {
            return ["曲が絞り切れませんでした。より具体的な名前をお試しください。"];
        }

        if (songs.length > 1) {
            const choices = songs.map((song) => `${song.songName}\nsetscore /${song.songId}, ${integerToDifficulty(difficulty)}, ${score}\n`);

            return [
                "曲が絞り切れませんでした。以下より該当の曲を選び、その真下のコマンドを入力してください。\n",
                ...choices
            ];
        }

        await setSingleScore(context.playerId, songs[0].songId, difficulty, score);

        return [`${songs[0].songName}: ${score}`];
    }
};
