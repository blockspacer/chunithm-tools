import {Difficulty} from "./difficulty";

export type HistoryList = Array<{
    songName: string,
    difficulty: Difficulty,
    time: string,
    score: number
}>;

export function validateHistoryList(history: HistoryList) {
    return history.reduce<boolean>((prev, score) => prev
                                                 && typeof score.songName === "string"
                                                 && typeof score.difficulty === "number"
                                                 && typeof score.time === "string"
                                                 && typeof score.score === "number",
                                   true);
}
