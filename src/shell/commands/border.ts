import {searchSongs} from "../../controllers/songs";
import {calcBorder} from "../../helper/calculator";
import {scoreToInteger} from "../../helper/formatter";
import {Command, CommandErrorKinds} from "../models";

export const border: Command = {
    name: "border",
    help: ["border 曲名,スコア", "指定された曲で指定された以上のスコアのために出せる最大のJUSTICE-ATTACK数を表示します。"],
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

        const score = scoreToInteger(params[1]);

        if (/^\d+$/.test(params[0])) {
            const notes = parseInt(params[0], 10);
            const borders = calcBorder(notes, score);

            return [
                `${notes} notes`,
                ...borders.map((border) => `${border.justice}-${border.attack}`)
            ];
        }

        const songs = await searchSongs(params[0]);

        if (songs.length === 0) {
            return ["曲が見つかりませんでした。"];
        }

        if (songs.length > 5) {
            return ["曲が絞り切れませんでした。より具体的な名前をお試しください。"];
        }

        if (songs.length > 1) {
            const choices = songs.map((song) => `${song.songName}\nborder /${song.songId}, ${params[1]}\n`);

            return [
                "曲が絞り切れませんでした。以下より該当の曲を選び、その真下のコマンドを入力してください。\n",
                ...choices
            ];
        }

        const borders = calcBorder(songs[0].notes, score);

        return [
            songs[0].songName,
            ...borders.map((border) => `${border.justice}-${border.attack}`)
        ];
    }
};
