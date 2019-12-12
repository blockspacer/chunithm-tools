import * as DifficultyModel from "../../src/controllers/difficulty";
import {setPlayer} from "../../src/controllers/players";
import {getBorderedScoreCount, setScores} from "../../src/controllers/scores";
import {createSong} from "../../src/controllers/songs";
import {knex} from "../../src/knex_wrapper";
import {Difficulty} from "../../src/models/difficulty";
import {ScoreList} from "../../src/models/score_list";

describe("曲の適正難易度の算出", () => {
    beforeAll(() => {
        const playerRates = [1500, 1525, 1550];
        const scores: ScoreList[] = [
            {
                1: [[0, 0], [0, 0], [0, 0], [1005000, 0]],
                2: [[0, 0], [0, 0], [0, 0], [1007000, 0]],
                3: [[0, 0], [0, 0], [0, 0], [1009000, 0]]
            }, {
                1: [[0, 0], [0, 0], [0, 0], [1007000, 0]],
                2: [[0, 0], [0, 0], [0, 0], [1009000, 0]],
                3: [[0, 0], [0, 0], [0, 0], [1005000, 0]]
            }, {
                1: [[0, 0], [0, 0], [0, 0], [1009000, 0]],
                2: [[0, 0], [0, 0], [0, 0], [1005000, 0]],
                3: [[0, 0], [0, 0], [0, 0], [1007000, 0]]
            }
        ];

        return Promise.all([
            ...playerRates.map((rate, index) => setPlayer(String(index), "", rate, rate, "", 0, 0)),
            ...scores.map((score, index) => setScores(String(index), score)),
            createSong(1, "", 0, 0, 0, 100, 0, "", "", 0),
            createSong(2, "", 0, 0, 0, 110, 0, "", "", 0),
            createSong(3, "", 0, 0, 0, 120, 0, "", "", 0)
        ]);
    });

    afterAll(() => {
        return Promise.all([
            knex("players").del(),
            knex("songs").del(),
            knex("scores").del(),
            knex("difficulty").del()
        ]);
    });

    test("適正難易度のキャッシュ", () => {
        return expect(DifficultyModel.cacheDifficulty())
                .resolves
                .toBeUndefined();
    });

    test("適正難易度の取得", () => {
        return expect(Promise.all([
                DifficultyModel.getDifficulty(1, 1010000),
                DifficultyModel.getDifficulty(1, 1009000),
                DifficultyModel.getDifficulty(1, 1008000),
                DifficultyModel.getDifficulty(1, 1007000),
                DifficultyModel.getDifficulty(1, 1006000),
                DifficultyModel.getDifficulty(1, 1005000),
                DifficultyModel.getDifficulty(1, 1004000)
            ]))
            .resolves
            .toMatchObject([
                1550,
                1550,
                1525,
                1525,
                1500,
                1500,
                1298
            ]);
    });

    test("スコアの統計", () => {
        return expect(Promise.all([
                getBorderedScoreCount(1, [1007500, 1005000, 1000000]),
                getBorderedScoreCount(2, [1007500, 1005000, 1000000]),
                getBorderedScoreCount(3, [1007500, 1005000, 1000000])
            ]))
            .resolves
            .toMatchObject([
                [[1007500, 1], [1005000, 2], [1000000, 0]],
                [[1007500, 1], [1005000, 2], [1000000, 0]],
                [[1007500, 1], [1005000, 2], [1000000, 0]]
            ]);
    });

    test("レートごとのスコアの統計", () => {
        const result = [
            [1500, 1005000],
            [1550, 1009000]
        ];

        return expect(Promise.all([
                DifficultyModel.statistics(1),
                DifficultyModel.statistics(2),
                DifficultyModel.statistics(3)
            ]))
            .resolves
            .toMatchObject([
                result,
                result,
                result
            ]);
    });

    test("リコメンドの取得", () => {
        return expect(Promise.all([
                DifficultyModel.getRecommend("0"),
                DifficultyModel.getRecommend("1", {count: 2}),
                DifficultyModel.getRecommend("2", {minRateValue: 110, maxRateValue: 110}),
            ]))
            .resolves
            .toMatchObject([
                [
                    {
                        song: {
                            songId: 1,
                            songName: "",
                            difficulty: Difficulty.MASTER,
                            rateValue: 100,
                            notes: 0,
                            scoreVideo: "",
                            scoreImage: "",
                            genreId: 0
                        },
                        rate: 1500,
                    }, {
                        song: {
                            songId: 2,
                            songName: "",
                            difficulty: Difficulty.MASTER,
                            rateValue: 110,
                            notes: 0,
                            scoreVideo: "",
                            scoreImage: "",
                            genreId: 0
                        },
                        rate: 1525,
                    }, {
                        song: {
                            songId: 3,
                            songName: "",
                            difficulty: Difficulty.MASTER,
                            rateValue: 120,
                            notes: 0,
                            scoreVideo: "",
                            scoreImage: "",
                            genreId: 0
                        },
                        rate: 1550,
                    }
                ], [
                    {
                        song: {
                            songId: 3,
                            songName: "",
                            difficulty: Difficulty.MASTER,
                            rateValue: 120,
                            notes: 0,
                            scoreVideo: "",
                            scoreImage: "",
                            genreId: 0
                        },
                        rate: 1500,
                    }, {
                        song: {
                            songId: 1,
                            songName: "",
                            difficulty: Difficulty.MASTER,
                            rateValue: 100,
                            notes: 0,
                            scoreVideo: "",
                            scoreImage: "",
                            genreId: 0
                        },
                        rate: 1525,
                    }
                ], [
                    {
                        song: {
                            songId: 2,
                            songName: "",
                            difficulty: Difficulty.MASTER,
                            rateValue: 110,
                            notes: 0,
                            scoreVideo: "",
                            scoreImage: "",
                            genreId: 0
                        },
                        rate: 1500,
                    }
                ]
            ]);
    });
});
