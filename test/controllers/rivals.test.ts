import {setPlayer} from "../../src/controllers/players";
import * as Rivals from "../../src/controllers/rivals";
import * as Scores from "../../src/controllers/scores";
import {createSong} from "../../src/controllers/songs";
import {knex} from "../../src/knex_wrapper";
import {Difficulty} from "../../src/models/difficulty";
import {RivalDifference} from "../../src/models/rival_difference";

describe("ライバルデータの扱い", () => {
    beforeAll(() => {
        return Promise.all([
            createSong(11, "BE MY BABY", 20, 50, 80, 110, 0, "", "", 0),
            createSong(12, "Don't stop my love", 30, 60, 90, 120, 0, "", "", 0),
            createSong(13, "1990", 40, 70, 100, 130, 0, "", "", 0),
            setPlayer("kikkawa", "kikkawa", 0, 0, "", 0, 0),
            setPlayer("hotei",   "hotei",   0, 0, "", 0, 0),
            Scores.setScores("kikkawa", {
                11: [
                    [1009000, 2],
                    [1008000, 1],
                    [1007500, 1],
                    [1004000, 1]
                ],
                12: [
                    [1008500, 1],
                    [1007500, 1],
                    [1005000, 1],
                    [1000000, 0]
                ]
            }),
            Scores.setScores("hotei", {
                12: [
                    [1008000, 1],
                    [1007000, 1],
                    [1004000, 1],
                    [1000000, 0]
                ],
                13: [
                    [1007500, 0],
                    [1005000, 0],
                    [1002500, 0],
                    [1000000, 0]
                ]
            })
        ]);
    });

    afterAll(() => {
        return Promise.all([
            knex("songs").del(),
            knex("scores").del()
        ]);
    });

    test("ライバル登録コードの発行", () => {
        return expect(Rivals.issueRivalCode("kikkawa"))
                .resolves.not.toThrowError();
    });

    test("ライバル登録コードの取得", async () => {
        const code = await Rivals.issueRivalCode("kikkawa");
        return expect(Rivals.getRivalCode("kikkawa"))
                .resolves.toBe(code);
    });

    test("ライバル登録コードの参照", async () => {
        const code = await Rivals.issueRivalCode("kikkawa");
        return expect(Rivals.referenceRivalCode(code))
                .resolves.toBe("kikkawa");
    });

    test("ライバルの追加", () => {
        return expect(Rivals.addRival("kikkawa", "hotei"))
                .resolves.toBeTruthy();
    });

    test("重複したライバルの追加", () => {
        return expect(Rivals.addRival("kikkawa", "hotei"))
                .resolves.toBeFalsy();
    });

    test("ライバルランキング", () => {
        return expect(Rivals.rivalRanking("kikkawa", 12, Difficulty.EXPERT))
                .resolves
                .toMatchObject([
                    {playerName: "kikkawa", score: 1005000},
                    {playerName: "hotei",   score: 1004000}
                ]);
    });

    test("ライバルの除去", () => {
        return expect(Rivals.removeRival("kikkawa", "hotei"))
                .resolves.toBeTruthy();
    });

    test("重複したライバルの除去", () => {
        return expect(Rivals.removeRival("kikkawa", "hotei"))
                .resolves.toBeFalsy();
    });

    test("スコアの比較", () => {
        const scores: {[key: number]: [[number, number], [number, number], [number, number], [number, number]]} = {
            11: [
                [1009000, 0],
                [1008000, 0],
                [1007500, 0],
                [1004000, 0]
            ],
            12: [
                [1008500, 1008000],
                [1007500, 1007000],
                [1005000, 1004000],
                [1000000, 1000000]
            ],
            13: [
                [0, 1007500],
                [0, 1005000],
                [0, 1002500],
                [0, 1000000]
            ]
        };
        const songs: {[key: number]: [string, number[]]} = {
            11: ["BE MY BABY",         [20, 50,  80, 110]],
            12: ["Don't stop my love", [30, 60,  90, 120]],
            13: ["1990",               [40, 70, 100, 130]]
        };
        const difficulties = [Difficulty.BASIC, Difficulty.ADVANCED, Difficulty.EXPERT, Difficulty.MASTER];
        const expected = difficulties.reduce<RivalDifference[]>((acc, dif) => {
            acc.push(...[11, 12, 13].map((songId) => ({
                song: {
                    songId,
                    songName: songs[songId][0],
                    difficulty: dif,
                    rateValue: songs[songId][1][dif],
                    notes: 0,
                    scoreVideo: "",
                    scoreImage: "",
                    genreId: 0
                },
                myScore: scores[songId][dif][0],
                rivalScore: scores[songId][dif][1]
            })));
            return acc;
        }, []);

        return expect(Rivals.compare("kikkawa", "hotei"))
                .resolves
                .toMatchObject(expected);
    });
});
