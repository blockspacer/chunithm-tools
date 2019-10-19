import {Difficulty} from "./difficulty";

export type HistoryList = Array<{
    songName: string,
    difficulty: Difficulty,
    time: string,
    score: number
}>;
