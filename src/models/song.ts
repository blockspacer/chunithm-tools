import {Genre} from "./genre";

export type Song = {
    songId: number,
    songName: string,
    basicRateValue: number,
    advancedRateValue: number,
    expertRateValue: number,
    masterRateValue: number,
    notes: number,
    scoreVideo: string,
    scoreImage: string,
    genreId: Genre
};
