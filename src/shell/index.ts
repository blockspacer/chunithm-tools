import {commands} from "./commands";
import {CommandErrorKinds, Context} from "./models";

const errorMessages = [
    "コマンドが見つかりませんでした。",
    "パラメーターが少なすぎます。",
    "パラメーターが多すぎます。",
    "ログインしてからご利用ください。",
    "プレイヤーデータを登録してからご利用ください。",
    "グループ内でご利用ください。"
];

export async function executeCommand(command: string, context: Context): Promise<string[]> {
    const spaceSeparated = command.split(" ");
    const merged = [spaceSeparated[0], spaceSeparated.slice(1).join(" ")];
    const commandName = merged[0].toLowerCase();
    const parameters = merged[1] !== ""
                       ? merged[1].split(",").map((x) => x.trim())
                       : [];

    if (!(commandName in commands)) {
        if (!context.groupId) {
            if (parameters.length === 0) {
                const result = await commands.detail.body([commandName], context);
                if ("error" in result) {
                    return ["Error: ", errorMessages[result.error] || "不明なエラーです。"];
                }
                return result;
            }
            return ["Error: ", errorMessages[CommandErrorKinds.COMMAND_NOT_FOUND]];
        }
        return [];
    }

    const result = await commands[commandName].body(parameters, context);
    if ("error" in result) {
        return ["Error: ", errorMessages[result.error] || "不明なエラーです。"];
    }

    return result;
}
