import {getSingleSong, searchSongs} from "../../controllers/songs";
import {integerToDifficulty, integerToRateValue} from "../../helper/formatter";
import {Difficulty} from "../../models/difficulty";
import {Command, CommandErrorKinds} from "../models";

export const info: Command = {
    name: "info",
    help: ["info 曲名", "指定された曲の情報を表示します。"],
    body: async (params) => {
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

        const songs = await searchSongs(params[0]);

        if (songs.length === 0) {
            return ["曲が見つかりませんでした。"];
        }

        if (songs.length > 5) {
            return ["曲が絞り切れませんでした。より具体的な名前をお試しください。"];
        }

        if (songs.length > 1) {
            const choices = songs.map((song) => `${song.songName}\ninfo /${song.songId}\n`);

            return [
                "曲が絞り切れませんでした。以下より該当の曲を選び、その真下のコマンドを入力してください。\n",
                ...choices
            ];
        }

        const song = await getSingleSong(songs[0].songId);

        if (song.length !== 4) {
            return {
                error: -1
            };
        }

        const difficulties = [Difficulty.MASTER, Difficulty.EXPERT, Difficulty.ADVANCED, Difficulty.BASIC];

        return [
            songs[0].songName,
            ...difficulties.reduce<string[]>((acc, dif) => {
                const difficulty = integerToDifficulty(dif).toUpperCase();
                const rateValue = integerToRateValue(song[dif].rateValue);
                const notes = song[dif].notes;
                acc.push(
                    `${difficulty}: ${rateValue}`,
                    `${notes} notes`
                );
                return acc;
            }, [])
        ];
    }
};
