import * as Groups from "../../src/controllers/groups";
import {setPlayer} from "../../src/controllers/players";
import {setScores} from "../../src/controllers/scores";
import {createSong} from "../../src/controllers/songs";
import {knex} from "../../src/knex_wrapper";
import {Difficulty} from "../../src/models/difficulty";

describe("グループの取り扱い", () => {
    beforeAll(() => {
        return Promise.all([
            setPlayer("alice", "ALICE", 1498, 1502, "", 0, 0),
            setPlayer("bob",   "Bob",   1497, 1504, "", 0, 0),
            setPlayer("chris", "CHR",   1500, 1500, "", 0, 0),
            setScores("alice", {
                1: [[1009900, 0], [0, 0], [0, 0], [1007500, 0]],
                2: [[1009800, 0], [0, 0], [0, 0], [1000000, 0]]
            }),
            setScores("bob", {
                1: [[1009900, 0], [0, 0], [0, 0], [1000000, 0]],
                2: [[1009800, 0], [0, 0], [0, 0], [1005000, 0]]
            }),
            setScores("chris", {
                1: [[1009900, 0], [0, 0], [0, 0], [1003000, 0]],
                2: [[1009800, 0], [0, 0], [0, 0], [1003000, 0]]
            }),
            createSong(1, "", 40, 70, 100, 130, 0, "", "", 0),
            createSong(2, "", 40, 70, 100, 130, 0, "", "", 0)
        ]);
    });

    afterAll(() => {
        return Promise.all([
            knex("players").del(),
            knex("scores").del(),
            knex("songs").del(),
            knex("groupmembers").del()
        ]);
    });

    test("グループへの参加", () => {
        return expect(Promise.all([
                Groups.joinGroup("group1", "alice"),
                Groups.joinGroup("group1", "bob"),
                Groups.joinGroup("group1", "chris"),
                Groups.joinGroup("group2", "alice"),
                Groups.joinGroup("group2", "chris")
            ]))
            .resolves
            .toMatchObject([
                true,
                true,
                true,
                true,
                true
            ]);
    });

    test("グループからの脱退", () => {
        return expect(Promise.all([
                Groups.leaveGroup("group1", "chris"),
                Groups.leaveGroup("group3", "alice")
            ]))
            .resolves
            .toMatchObject([
                true,
                false
            ]);
    });

    test("トータルスコアランキング", () => {
        return expect(Groups.totalRanking("group1", Difficulty.MASTER))
                .resolves
                .toMatchObject([
                    {
                        playerName: "ALICE",
                        score: 2007500
                    }, {
                        playerName: "Bob",
                        score: 2005000
                    }
                ]);
    });

    test("単曲スコアランキング", () => {
        return expect(Promise.all([
                Groups.songRanking("group1", 1, Difficulty.MASTER),
                Groups.songRanking("group1", 2, Difficulty.MASTER),
            ]))
            .resolves
            .toMatchObject([
                [
                    {
                        playerName: "ALICE",
                        score: 1007500
                    }, {
                        playerName: "Bob",
                        score: 1000000
                    }
                ],
                [
                    {
                        playerName: "Bob",
                        score: 1005000
                    }, {
                        playerName: "ALICE",
                        score: 1000000
                    }
                ]
            ]);
    });

    test("現在レートランキング", () => {
        return expect(Groups.currentRateRanking("group1"))
                .resolves
                .toMatchObject([
                    {
                        playerName: "ALICE",
                        score: 1498
                    }, {
                        playerName: "Bob",
                        score: 1497
                    }
                ]);
    });

    test("最高レートランキング", () => {
        return expect(Groups.maxRateRanking("group1"))
                .resolves
                .toMatchObject([
                    {
                        playerName: "Bob",
                        score: 1504
                    }, {
                        playerName: "ALICE",
                        score: 1502
                    }
                ]);
    });

    test("ベスト枠平均ランキング", () => {
        return expect(Groups.bestAverageRanking("group1"))
                .resolves
                .toMatchObject([
                    {
                        playerName: "ALICE",
                        score: (1500 + 1400 + 600 + 600) / 30
                    }, {
                        playerName: "Bob",
                        score: (1450 + 1400 + 600 + 600) / 30
                    }
                ]);
    });
});
