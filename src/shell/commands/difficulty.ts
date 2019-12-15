import {getDifficulty} from "../../controllers/difficulty";
import {searchSongs} from "../../controllers/songs";
import {integerToRate, scoreToInteger} from "../../helper/formatter";
import {Command, CommandErrorKinds} from "../models";

export const difficulty: Command = {
    name: "difficulty",
    help: ["difficulty 曲名,スコア", "指定された曲で指定されたスコアを取る難易度を統計的に分析し、レートの形で表示します。"],
    body: async (params) => {
        if (params.length < 2) {
            return {
                error: CommandErrorKinds.TOO_FEW_PARAMETERS
            };
        }

        if (params.length > 2) {
            return {
                error: CommandErrorKinds.TOO_MANY_PARAMETERS
            };
        }

        const songs = await searchSongs(params[0]);
        const score = scoreToInteger(params[1]);

        if (songs.length === 0) {
            return ["曲が見つかりませんでした。"];
        }

        if (songs.length > 5) {
            return ["曲が絞り切れませんでした。より具体的な名前をお試しください。"];
        }

        if (songs.length > 1) {
            const choices = songs.map((song) => `${song.songName}\ndifficulty /${song.songId}, ${params[1]}\n`);

            return [
                "曲が絞り切れませんでした。以下より該当の曲を選び、その真下のコマンドを入力してください。\n",
                ...choices
            ];
        }

        const difficulty = await getDifficulty(songs[0].songId, score);

        return [
            songs[0].songName,
            integerToRate(difficulty)
        ];
    }
};
