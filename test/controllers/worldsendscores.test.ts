import * as WorldsEndScores from "../../src/controllers/worldsendscores";
import {createWorldsEndSong} from "../../src/controllers/worldsendsongs";
import {knex} from "../../src/knex_wrapper";

describe("スコアデータの扱い", () => {
    beforeAll(() => {
        return Promise.all([
            createWorldsEndSong(8011, "BE MY BABY", 11, 1, 1000, "", ""),
            createWorldsEndSong(8012, "Don't stop my love", 12, 2, 2000, "", ""),
            createWorldsEndSong(8013, "1990", 13, 3, 3000, "", "")
        ]);
    });

    afterAll(() => {
        return Promise.all([
            knex("worldsendsongs").del(),
            knex("worldsendscores").del()
        ]);
    });

    test("スコアの追加", () => {
        return expect(WorldsEndScores.setWorldsEndScores("eliza", {
                    8011: [1009000, 1],
                    8012: [1008000, 0],
                    8013: [1007000, 0]
                }))
            .resolves
            .toBeUndefined();
    });

    test("スコアの確認", () => {
        return expect(Promise.all([
                WorldsEndScores.getWorldsEndScores("eliza", {songId: 8011}),
                WorldsEndScores.getWorldsEndScores("eliza", {maxScore: 1008000})
            ]))
            .resolves
            .toMatchObject([
                [
                    {
                        song: {
                            songId: 8011,
                            songName: "BE MY BABY",
                            parentSongId: 11,
                            difficulty: 1,
                            notes: 1000,
                            scoreVideo: "",
                            scoreImage: ""
                        },
                        score: 1009000,
                        mark: 1
                    }
                ], [
                    {
                        song: {
                            songId: 8012,
                            songName: "Don't stop my love",
                            parentSongId: 12,
                            difficulty: 2,
                            notes: 2000,
                            scoreVideo: "",
                            scoreImage: ""
                        },
                        score: 1008000,
                        mark: 0
                    }, {
                        song: {
                            songId: 8013,
                            songName: "1990",
                            parentSongId: 13,
                            difficulty: 3,
                            notes: 3000,
                            scoreVideo: "",
                            scoreImage: ""
                        },
                        score: 1007000,
                        mark: 0
                    }
                ]
            ]);
    });
});
