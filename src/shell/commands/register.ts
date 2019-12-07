import {createUser} from "../../controllers/users";
import {Command, CommandErrorKinds} from "../models";

export const register: Command = {
    name: "register",
    help: [
        "register ユーザーID, パスワード",
        "CHUNITHM Tools Web版及びブックマークレットを使用するためのユーザーIDとパスワードを登録します。",
        "ユーザーIDは英数字、パスワードはASCII文字のみで構成されている必要があります。"
    ],
    body: async (params, context) => {
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

        if (!context.playerId) {
            return {
                error: CommandErrorKinds.PLAYER_INFO_IS_MISSING
            };
        }

        const userId = params[0];
        const password = params[1];

        if (!/^[a-zA-Z0-9]+$/u.test(userId)) {
            return ["ユーザーIDが無効な文字を含んでいます。"];
        }

        if (!/^[\x20-\x7e]+$/u.test(password)) {
            return ["パスワードが無効な文字を含んでいます。"];
        }

        if (await createUser(userId, password, context.playerId)) {
            return ["登録に成功しました。"];
        }

        return ["ユーザー名は既に使用されています。"];
    }
};
