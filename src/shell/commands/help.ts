import {Command, CommandErrorKinds} from "../models";
import {commands} from "./index";

export const help: Command = {
    name: "help",
    help: [
        "help コマンド名",
        "指定されたコマンドのヘルプを表示します。",
        "コマンド名にlistを指定した場合、コマンドリストを表示します。",
        "各コマンドのヘルプの1行目はコマンドの使用法です。",
        "[]で囲まれた部分は省略することが出来ます。"
    ],
    body: async (params) => {
        if (params.length === 0) {
            return commands["help"].help;
        }

        if (params[0] === "list") {
            return [
                "border - ボーダーを算出します。",
                "difficulty - 曲の難易度を取得します。",
                "help - コマンドのヘルプを表示します。",
                "info - 曲の情報を取得します。",
                "mybest - 曲の情報を取得します。",
                "ping - CHUNITHM Toolsの動作確認を行います。",
                "profile - プレイヤーのプロフィールを表示します。",
                "rank - グループ内のスコアランキングを表示します。",
            ];
        }

        if (!(params[0] in commands)) {
            return {
                error: CommandErrorKinds.COMMAND_NOT_FOUND
            };
        }

        return commands[params[0]].help;
    }
};
