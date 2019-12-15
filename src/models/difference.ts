import {Song} from "./song";

export type Difference = {
    song: Song,
    oldScore: number,
    newScore: number
};
