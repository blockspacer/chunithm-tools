import {bestAverageRanking, currentRateRanking, joinGroup, leaveGroup, maxRateRanking, songRanking, totalRanking} from "../../controllers/groups";
import {searchSongs} from "../../controllers/songs";
import {difficultyNameToInteger, integerToRate} from "../../helper/formatter";
import {Command, CommandErrorKinds} from "../models";

export const rank: Command = {
    name: "rank",
    help: [
        "rank 曲名[,難易度]",
        "指定された曲のグループ内スコアランキングを表示します。",
        "参加者はグループごとに管理され、曲名にjoinを指定すると参加、leaveを指定すると脱退します。",
        "難易度を省略した場合は自動的にMASTERが指定されます。",
        "曲名に以下の語句を指定すると、特別なランキングを表示します。",
        "total: トータルハイスコア",
        "rate: 現在レート",
        "maxrate: 最大レート",
        "best: ベスト枠平均"
    ],
    body: async (params, context) => {
        if (params.length < 1) {
            return {
                error: CommandErrorKinds.TOO_FEW_PARAMETERS
            };
        }

        if (params.length > 2) {
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
        const difficulty = difficultyNameToInteger(params[1] || "MASTER");

        if (query === "total") {
            const rank = await totalRanking(context.groupId, difficulty);
            return [
                "Total score",
                ...rank.map((score) => `${(score.playerName + "　　　").slice(0, 4)}: ${score.score}`)
            ];
        }

        if (query === "rate") {
            const rank = await currentRateRanking(context.groupId);
            return [
                "Current rate",
                ...rank.map((score) => `${(score.playerName + "　　　").slice(0, 4)}: ${integerToRate(score.score)}`)
            ];
        }

        if (query === "maxrate") {
            const rank = await maxRateRanking(context.groupId);
            return [
                "Maximum rate",
                ...rank.map((score) => `${(score.playerName + "　　　").slice(0, 4)}: ${integerToRate(score.score)}`)
            ];
        }

        if (query === "best") {
            const rank = await bestAverageRanking(context.groupId);
            return [
                "Best scores average",
                ...rank.map((score) => `${(score.playerName + "　　　").slice(0, 4)}: ${integerToRate(score.score)}`)
            ];
        }

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

        const songs = await searchSongs(params[0]);

        if (songs.length === 0) {
            return ["曲が見つかりませんでした。"];
        }

        if (songs.length > 5) {
            return ["曲が絞り切れませんでした。より具体的な名前をお試しください。"];
        }

        if (songs.length > 1) {
            const choices = songs.map((song) => `${song.songName}\nrank /${song.songId}\n`);

            return [
                "曲が絞り切れませんでした。以下より該当の曲を選び、その真下のコマンドを入力してください。\n",
                ...choices
            ];
        }

        const rank = await songRanking(context.groupId, songs[0].songId, difficulty);

        return [
            songs[0].songName,
            ...rank.map((score) => `${(score.playerName + "　　　").slice(0, 4)}: ${score.score}`)
        ];
    }
};
