import * as Players from "../../src/controllers/players";

describe("プレイヤーデータの取り扱い", () => {
    test("プレイヤーデータの追加", () => {
        return expect(Promise.all([
                Players.setPlayer("alice", "ALICE", 1398, 1400, "NEW COMER",   0,  0, "2019-01-01"),
                Players.setPlayer("bob",   "Bob",   1495, 1502, "Blue Noise", 13, 12, "2019-01-02")
            ]))
            .resolves
            .not.toThrowError();
    });

    test("ユーザーデータの存在の取得", () => {
        return expect(Promise.all([
                Players.playerExists("alice"),
                Players.playerExists("bob"),
                Players.playerExists("chris")
            ]))
            .resolves
            .toMatchObject([
                true,
                true,
                false
            ]);
    });

    test("プレイヤーデータの取得", () => {
        return expect(Promise.all([
                Players.getPlayer("alice"),
                Players.getPlayer("bob")
            ]))
            .resolves
            .toMatchObject([
                {
                    playerName: "ALICE",
                    currentRate: 1398,
                    maxRate: 1400,
                    title: "NEW COMER",
                    emblemTop: 0,
                    emblemBase: 0
                }, {
                    playerName: "Bob",
                    currentRate: 1495,
                    maxRate: 1502,
                    title: "Blue Noise",
                    emblemTop: 13,
                    emblemBase: 12
                }
            ]);
    });

    test("プレイヤーデータの変更", () => {
        return expect(Promise.all([
                Players.setPlayer("alice", "ALICE", 1401, 1401, "NEW COMER",   0,  0, "2019-01-03"),
                Players.setPlayer("bob",   "Bob",   1503, 1503, "Blue Noise", 13, 12, "2019-01-04")
            ]))
            .resolves
            .not.toThrowError();
    });

    test("レートログの取得", () => {
        return expect(Promise.all([
                Players.getRateLog("alice"),
                Players.getRateLog("bob")
            ]))
            .resolves
            .toMatchObject([
                [
                    {
                        date: "2019-01-01",
                        currentRate: 1398,
                        maxRate: 1400
                    }, {
                        date: "2019-01-03",
                        currentRate: 1401,
                        maxRate: 1401
                    }
                ], [
                    {
                        date: "2019-01-02",
                        currentRate: 1495,
                        maxRate: 1502
                    }, {
                        date: "2019-01-04",
                        currentRate: 1503,
                        maxRate: 1503
                    }
                ]
            ]);
    });
});
