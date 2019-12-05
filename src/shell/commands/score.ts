import {searchSongs} from "../../controllers/songs";
import {Command, CommandErrorKinds} from "../models";

export const score: Command = {
    name: "score",
    help: ["score 曲名", "指定された曲の譜面情報を表示します。"],
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
            const choices = songs.map((song) => `${song.songName}\nscore /${song.songId}\n`);

            return [
                "曲が絞り切れませんでした。以下より該当の曲を選び、その真下のコマンドを入力してください。\n",
                ...choices
            ];
        }

        return [
            songs[0].songName,
            `動画: ${songs[0].scoreVideo}`,
            `画像: ${songs[0].scoreImage}`,
        ];
    }
};
