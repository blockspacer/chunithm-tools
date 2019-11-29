import {commands} from "./commands";
import {Context} from "./models";

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
    const commandName = merged[0];
    const parameters = merged[1] !== ""
                       ? merged[1].split(",").map((x) => x.trim())
                       : [];

    if (!(commandName in commands)) {
        return [];
    }

    const result = await commands[commandName].body(parameters, context);
    if ("error" in result) {
        return ["Error: ", errorMessages[result.error] || "不明なエラーです。"];
    }

    return result;
}
