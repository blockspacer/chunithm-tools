import * as Scores from "../../src/controllers/scores";
import {createSong} from "../../src/controllers/songs";
import {knex} from "../../src/knex_wrapper";
import {Difficulty} from "../../src/models/difficulty";

describe("スコアデータの扱い", () => {
    beforeAll(() => {
        return Promise.all([
            createSong(11, "BE MY BABY", 20, 50, 80, 110, 0, "", "", 0),
            createSong(12, "Don't stop my love", 30, 60, 90, 120, 0, "", "", 0),
            createSong(13, "1990", 40, 70, 100, 130, 0, "", "", 0)
        ]);
    });

    afterAll(() => {
        return Promise.all([
            knex("songs").del(),
            knex("scores").del()
        ]);
    });

    test("スコアの追加", () => {
        return expect(Scores.setScores("eliza", {
                11: [
                    [1009911, 2],
                    [1008811, 1],
                    [1007711, 1],
                    [1006611, 1]
                ],
                12: [
                    [1008812, 1],
                    [1007712, 1],
                    [1006612, 1],
                    [1005512, 0]
                ]}))
            .resolves
            .toBeUndefined();
    });

    test("スコアの確認", () => {
        return expect(Promise.all([
                Scores.getScores("eliza", {songId: 11, difficulty: Difficulty.MASTER}),
                Scores.getScores("eliza", {maxScore: 1005512}),
                Scores.getScores("eliza", {maxRateValue: 20})
            ]))
            .resolves
            .toMatchObject([
                [{
                    song: {
                        songId: 11,
                        songName: "BE MY BABY",
                        difficulty: Difficulty.MASTER,
                        rateValue: 110,
                        notes: 0,
                        scoreVideo: "",
                        scoreImage: "",
                        genreId: 0
                    },
                    score: 1006611,
                    mark: 1
                }], [{
                    song: {
                        songId: 12,
                        songName: "Don't stop my love",
                        difficulty: Difficulty.MASTER,
                        rateValue: 120,
                        notes: 0,
                        scoreVideo: "",
                        scoreImage: "",
                        genreId: 0
                    },
                    score: 1005512,
                    mark: 0
                }], [{
                    song: {
                        songId: 11,
                        songName: "BE MY BABY",
                        difficulty: Difficulty.BASIC,
                        rateValue: 20,
                        notes: 0,
                        scoreVideo: "",
                        scoreImage: "",
                        genreId: 0
                    },
                    score: 1009911,
                    mark: 2
                }]
            ]);
    });

    test("差分の登録", () => {
        return expect(Scores.setDifference("eliza", {
                12: [
                    [1008812, 1],
                    [1007712, 1],
                    [1006712, 1],
                    [1005512, 0]
                ],
                13: [
                    [0, 0],
                    [0, 0],
                    [0, 0],
                    [1004413, 0]
                ]}))
            .resolves
            .toBeUndefined();
    });

    test("差分の取得", () => {
        return expect(Scores.getDifference("eliza"))
            .resolves
            .toMatchObject([{
                song: {
                    songId: 12,
                    songName: "Don't stop my love",
                    difficulty: Difficulty.EXPERT,
                    rateValue: 90,
                    notes: 0,
                    scoreVideo: "",
                    scoreImage: "",
                    genreId: 0
                },
                oldScore: 1006612,
                newScore: 1006712
            }, {
                song: {
                    songId: 13,
                    songName: "1990",
                    difficulty: Difficulty.MASTER,
                    rateValue: 130,
                    notes: 0,
                    scoreVideo: "",
                    scoreImage: "",
                    genreId: 0
                },
                oldScore: 0,
                newScore: 1004413
            }]);
    });

    test("履歴の追加", () => {
        return expect(Scores.setHistories("eliza", [{
                    songName: "BE MY BABY",
                    difficulty: Difficulty.MASTER,
                    time: "1990-01-01 00:00",
                    score: 1007500
                }, {
                    songName: "Don't stop my love",
                    difficulty: Difficulty.MASTER,
                    time: "1990-01-03 00:00",
                    score: 1009500
                }, {
                    songName: "1990",
                    difficulty: Difficulty.MASTER,
                    time: "1990-01-02 00:00",
                    score: 1009000
                }]))
            .resolves
            .toBeUndefined();
    });

    test("履歴の取得", () => {
        return expect(Scores.getHistories("eliza", 3))
            .resolves
            .toMatchObject([{
                song: {
                    songId: 12,
                    songName: "Don't stop my love",
                    difficulty: Difficulty.MASTER,
                    rateValue: 120,
                    notes: 0,
                    scoreVideo: "",
                    scoreImage: "",
                    genreId: 0
                },
                time: "1990-01-03 00:00",
                score: 1009500
            }, {
                song: {
                    songId: 13,
                    songName: "1990",
                    difficulty: Difficulty.MASTER,
                    rateValue: 130,
                    notes: 0,
                    scoreVideo: "",
                    scoreImage: "",
                    genreId: 0
                },
                time: "1990-01-02 00:00",
                score: 1009000
            }, {
                song: {
                    songId: 11,
                    songName: "BE MY BABY",
                    difficulty: Difficulty.MASTER,
                    rateValue: 110,
                    notes: 0,
                    scoreVideo: "",
                    scoreImage: "",
                    genreId: 0
                },
                time: "1990-01-01 00:00",
                score: 1007500
            }]);
    });
});
