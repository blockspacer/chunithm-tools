import {getScores} from "../../controllers/scores";
import {searchSongs} from "../../controllers/songs";
import {integerToDifficulty} from "../../helper/formatter";
import {Difficulty} from "../../models/difficulty";
import {Command, CommandErrorKinds} from "../models";

export const mybest: Command = {
    name: "mybest",
    help: ["mybest 曲名", "指定された曲のスコアを表示します。"],
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

        const songs = await searchSongs(params[0]);

        if (songs.length === 0) {
            return ["曲が見つかりませんでした。"];
        }

        if (songs.length > 5) {
            return ["曲が絞り切れませんでした。より具体的な名前をお試しください。"];
        }

        if (songs.length > 1) {
            const choices = songs.map((song) => `${song.songName}\nmybest /${song.songId}\n`);

            return [
                "曲が絞り切れませんでした。以下より該当の曲を選び、その真下のコマンドを入力してください。\n",
                ...choices
            ];
        }

        const scores = (await getScores(context.playerId, {songId: songs[0].songId}))
                            .reduce<number[]>((acc, score) => {
                                acc[score.song.difficulty] = score.score;
                                return acc;
                            }, [0, 0, 0, 0]);

        const difficulties = [Difficulty.MASTER, Difficulty.EXPERT, Difficulty.ADVANCED, Difficulty.BASIC];

        return [
            songs[0].songName,
            ...difficulties.reduce<string[]>((acc, dif) => {
                const difficulty = integerToDifficulty(dif).toUpperCase();
                const score = String(scores[dif]);
                acc.push(
                    `${difficulty}: ${score}`
                );
                return acc;
            }, [])
        ];
    }
};
