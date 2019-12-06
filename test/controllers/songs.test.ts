import {setScores} from "../../src/controllers/scores";
import * as Songs from "../../src/controllers/songs";
import {knex} from "../../src/knex_wrapper";
import {Difficulty} from "../../src/models/difficulty";

describe("曲データの取り扱い", () => {
    beforeAll(() => {
        return setScores("1", {
            1: [[0, 0], [0, 0], [0, 0], [1000000, 0]],
            2: [[0, 0], [0, 0], [0, 0], [1005000, 0]],
            3: [[0, 0], [0, 0], [0, 0], [1010000, 0]]
        });
    });

    afterAll(() => {
        return Promise.all([
            knex("songs").del(),
            knex("scores").del()
        ]);
    });

    test("曲の作成", () => {
        return expect(Promise.all([
                    Songs.createSong(1, "Radetzky Marsch", 20, 50, 80, 110, 1000, "RMVideo", "RMImage", 0),
                    Songs.createSong(2, "RAGE OF DUST", 30, 60, 90, 120, 1500, "RDVideo", "RDImage", 1),
                    Songs.createSong(3, "BE MY BABY", 40, 70, 100, 130, 2000, "BMBVideo", "BMBImage", 2)
                ]))
            .resolves
            .not.toThrowError();
    });

    test("曲の検索", () => {
        return expect(Promise.all([
                    Songs.searchSongs("Radetzky Marsch"),
                    Songs.searchSongs("Ra", Difficulty.EXPERT),
                    Songs.searchSongs("xqx")
                ]))
            .resolves
            .toMatchObject([
                [
                    {
                        songId: 1,
                        songName: "Radetzky Marsch",
                        difficulty: Difficulty.MASTER,
                        rateValue: 110,
                        notes: 1000,
                        scoreVideo: "RMVideo",
                        scoreImage: "RMImage",
                        genreId: 0
                    }
                ], [
                    {
                        songId: 1,
                        songName: "Radetzky Marsch",
                        difficulty: Difficulty.EXPERT,
                        rateValue: 80,
                        notes: 0,
                        scoreVideo: "",
                        scoreImage: "",
                        genreId: 0
                    }, {
                        songId: 2,
                        songName: "RAGE OF DUST",
                        difficulty: Difficulty.EXPERT,
                        rateValue: 90,
                        notes: 0,
                        scoreVideo: "",
                        scoreImage: "",
                        genreId: 1
                    }
                ], []
            ]);
    });

    test("条件による曲の検索", () => {
        return expect(Promise.all([
                    Songs.getSongs("1", {minRateValue: 130}, Difficulty.MASTER),
                    Songs.getSongs("1", {minRateValue: 115, maxRateValue: 125}, Difficulty.MASTER),
                    Songs.getSongs("1", {minRateValue: 120, maxScore: 1005000}, Difficulty.MASTER)
                ]))
            .resolves
            .toMatchObject([
                [
                    {
                        songId: 3,
                        songName: "BE MY BABY",
                        difficulty: Difficulty.MASTER,
                        rateValue: 130,
                        notes: 2000,
                        scoreVideo: "BMBVideo",
                        scoreImage: "BMBImage",
                        genreId: 2
                    }
                ], [
                    {
                        songId: 2,
                        songName: "RAGE OF DUST",
                        difficulty: Difficulty.MASTER,
                        rateValue: 120,
                        notes: 1500,
                        scoreVideo: "RDVideo",
                        scoreImage: "RDImage",
                        genreId: 1
                    }
                ], [
                    {
                        songId: 2,
                        songName: "RAGE OF DUST",
                        difficulty: Difficulty.MASTER,
                        rateValue: 120,
                        notes: 1500,
                        scoreVideo: "RDVideo",
                        scoreImage: "RDImage",
                        genreId: 1
                    }
                ],
            ]);
    });

    test("単一曲の取得", () => {
        return expect(Songs.getSingleSong(1))
            .resolves
            .toMatchObject([
                {
                    songId: 1,
                    songName: "Radetzky Marsch",
                    difficulty: Difficulty.BASIC,
                    rateValue: 20,
                    notes: 0,
                    scoreVideo: "",
                    scoreImage: "",
                    genreId: 0
                }, {
                    songId: 1,
                    songName: "Radetzky Marsch",
                    difficulty: Difficulty.ADVANCED,
                    rateValue: 50,
                    notes: 0,
                    scoreVideo: "",
                    scoreImage: "",
                    genreId: 0
                }, {
                    songId: 1,
                    songName: "Radetzky Marsch",
                    difficulty: Difficulty.EXPERT,
                    rateValue: 80,
                    notes: 0,
                    scoreVideo: "",
                    scoreImage: "",
                    genreId: 0
                }, {
                    songId: 1,
                    songName: "Radetzky Marsch",
                    difficulty: Difficulty.MASTER,
                    rateValue: 110,
                    notes: 1000,
                    scoreVideo: "RMVideo",
                    scoreImage: "RMImage",
                    genreId: 0
                },
            ]);
    });

    test("曲の存在の確認", () => {
        return expect(Promise.all([
                    Songs.songExists(1),
                    Songs.songExists(4)
                ]))
            .resolves
            .toMatchObject([
                true,
                false
            ]);
    });

    test("ランダム選曲", () => {
        return expect(Songs.randomSongs(3, 120, 130))
            .resolves
            .toHaveLength(2);
    });
});
