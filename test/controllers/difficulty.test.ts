import * as Difficulty from "../../src/controllers/difficulty";
import {setPlayer} from "../../src/controllers/players";
import {setScores} from "../../src/controllers/scores";
import {createSong} from "../../src/controllers/songs";
import {knex} from "../../src/knex_wrapper";

describe("曲の適正難易度の算出", () => {
    beforeAll(() => {
        const playerRates = [1525, 1550];
        const scores = [1005000, 1007500];

        return Promise.all([
            ...playerRates.map((rate, index) => setPlayer(String(index), "", rate, rate, "", 0, 0)),
            ...scores.map((score, index) => setScores(String(index), {
                1: [[0, 0], [0, 0], [0, 0], [score, 0]]
            })),
            createSong(1, "", 0, 0, 0, 0, 0, "", "", 0)
        ]);
    });

    afterAll(() => {
        return Promise.all([
            knex("players").del(),
            knex("songs").del(),
            knex("difficulty").del()
        ]);
    });

    test("適正難易度のキャッシュ", () => {
        return expect(Difficulty.cacheDifficulty())
                .resolves
                .toBeUndefined();
    });

    test("適正難易度の取得", () => {
        return expect(Promise.all([
                    Difficulty.getDifficulty(1, 1008000),
                    Difficulty.getDifficulty(1, 1007500),
                    Difficulty.getDifficulty(1, 1006000),
                    Difficulty.getDifficulty(1, 1005000),
                    Difficulty.getDifficulty(1, 1004000)
                ]))
                .resolves
                .toMatchObject([
                    1550,
                    1550,
                    1525,
                    1525,
                    1298
                ]);
    });
});
