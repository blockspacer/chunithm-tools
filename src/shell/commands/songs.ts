import {getSongs} from "../../controllers/songs";
import {difficultyToInteger, rateValueToInteger} from "../../helper/formatter";
import {Difficulty} from "../../models/difficulty";
import {Command, CommandErrorKinds} from "../models";

type Options = {
    minScore?: number,
    maxScore?: number,
    minRateValue?: number,
    maxRateValue?: number
};

function shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i >= 0; i--) {
        const index = Math.floor(Math.random() * (i + 1));
        const tmp = array[i];
        array[i] = array[index];
        array[index] = tmp;
    }

    return array;
}

export const songs: Command = {
    name: "songs",
    help: [
        "songs オプション",
        "指定された条件で曲を表示します。オプションは複数指定できます。",
        "v譜面定数/v[下限譜面定数]-[上限譜面定数]",
        "d難易度/d[下限難易度]-[上限難易度]",
        "s[スコア下限]-[スコア上限]",
        "c曲数",
        "a (全ての曲を表示)"
    ],
    body: async (params, context) => {
        if (!context.playerId) {
            return {
                error: CommandErrorKinds.PLAYER_INFO_IS_MISSING
            };
        }

        let count = 1;

        const optionStrings = (params[0] || "").match(/[a-zA-Z][0-9.+]*(-[0-9.+]*)?/g) || [];
        const options: Options = optionStrings.reduce<Options>((acc, option) => {
                const item = option.slice(0, 1);
                const parameters = option.slice(1).split("-", 2);

                switch (item) {
                    case "v": {
                        const min = rateValueToInteger(parameters[0] || "1.0");
                        const max = rateValueToInteger(parameters[parameters.length - 1] || "15.0");
                        acc.minRateValue = min;
                        acc.maxRateValue = max;
                        break;
                    }

                    case "d": {
                        const min = difficultyToInteger(parameters[0] || "1").min;
                        const max = difficultyToInteger(parameters[parameters.length - 1] || "15").max;
                        acc.minRateValue = min;
                        acc.maxRateValue = max;
                        break;
                    }

                    case "s": {
                        const min = parseInt(parameters[0] || "0", 10);
                        const max = parseInt(parameters[parameters.length - 1] || "1010000", 10);
                        acc.minScore = min;
                        acc.maxRateValue = max;
                        break;
                    }

                    case "c": {
                        count = parseInt(parameters[0] || "1", 10);
                        break;
                    }

                    case "a": {
                        count = 999;
                        break;
                    }
                }

                return acc;
            }, {});

        const songs = await getSongs(context.playerId, options, Difficulty.MASTER);
        console.log(options);

        return shuffleArray(songs).slice(0, count).map((song) => song.songName);
    }
};
