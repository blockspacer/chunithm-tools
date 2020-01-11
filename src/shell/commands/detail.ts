import {searchSongs} from "../../controllers/songs";
import {calcBorder} from "../../helper/calculator";
import {integerToRateValue} from "../../helper/formatter";
import {Command, CommandErrorKinds} from "../models";

export const detail: Command = {
    name: "detail",
    help: ["detail", "曲の情報を表示します。"],
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
            const choices = songs.map((song) => `${song.songName}\n/${song.songId}\n`);

            return [
                "曲が絞り切れませんでした。以下より該当の曲を選び、その真下のコマンドを入力してください。\n",
                ...choices
            ];
        }

        const borders = calcBorder(songs[0].notes, 1007500);

        return [
            songs[0].songName,
            `MASTER: ${integerToRateValue(songs[0].rateValue)}`,
            `${songs[0].notes} notes`,
            `動画: ${songs[0].scoreVideo}`,
            `画像: ${songs[0].scoreImage}`,
            ...borders.map((border) => `${border.justice}-${border.attack}`)
        ];
    }
};
