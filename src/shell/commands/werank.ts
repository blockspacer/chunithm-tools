import {joinGroup, leaveGroup, worldsEndSongRanking} from "../../controllers/groups";
import {searchWorldsEndSongs} from "../../controllers/worldsendsongs";
import {Command, CommandErrorKinds} from "../models";

export const werank: Command = {
    name: "werank",
    help: [
        "werank 曲名",
        "指定されたWorld's End曲のグループ内スコアランキングを表示します。",
        "参加者はグループごとに管理され、曲名にjoinを指定すると参加、leaveを指定すると脱退します。"
    ],
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

        if (!context.groupId) {
            return {
                error: CommandErrorKinds.GROUP_INFO_IS_MISSING
            };
        }

        const query = params[0];

        if (query === "join") {
            return (await joinGroup(context.groupId, context.playerId))
                    ? ["グループに参加しました。"]
                    : ["グループに既に参加しています。"];
        }

        if (query === "leave") {
            return (await leaveGroup(context.groupId, context.playerId))
                    ? ["グループから脱退しました。"]
                    : ["このグループに所属していません。"];
        }

        const songs = await searchWorldsEndSongs(params[0]);

        if (songs.length === 0) {
            return ["曲が見つかりませんでした。"];
        }

        if (songs.length > 5) {
            return ["曲が絞り切れませんでした。より具体的な名前をお試しください。"];
        }

        if (songs.length > 1) {
            const choices = songs.map((song) => `${song.songName}\nwerank /${song.songId}\n`);

            return [
                "曲が絞り切れませんでした。以下より該当の曲を選び、その真下のコマンドを入力してください。\n",
                ...choices
            ];
        }

        const rank = await worldsEndSongRanking(context.groupId, songs[0].songId);

        return [
            songs[0].songName,
            ...rank.map((score) => `${(score.playerName + "　　　").slice(0, 4)}: ${score.score}`)
        ];
    }
};
