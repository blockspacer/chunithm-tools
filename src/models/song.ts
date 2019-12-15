import {Difficulty} from "./difficulty";
import {Genre} from "./genre";

export type Song = {
    songId: number,
    songName: string,
    difficulty: Difficulty,
    rateValue: number,
    notes: number,
    scoreVideo: string,
    scoreImage: string,
    genreId: Genre
};
