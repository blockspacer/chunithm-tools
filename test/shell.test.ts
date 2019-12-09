import {cacheDifficulty} from "../src/controllers/difficulty";
import {setPlayer} from "../src/controllers/players";
import {setScores} from "../src/controllers/scores";
import {createSong} from "../src/controllers/songs";
import {setWorldsEndScores} from "../src/controllers/worldsendscores";
import {createWorldsEndSong} from "../src/controllers/worldsendsongs";
import {knex} from "../src/knex_wrapper";
import {ScoreList} from "../src/models/score_list";
import {WorldsEndScoreList} from "../src/models/worldsendscore_list";
import {executeCommand} from "../src/shell";

describe("シェル", () => {
    beforeAll(async () => {
        const playerRates = [1500, 1525, 1550];
        const scores: ScoreList[] = [
            {
                1: [[      0, 0], [      0, 0], [      0, 0], [1005000, 0]],
                2: [[      0, 0], [      0, 0], [      0, 0], [1007000, 0]],
                3: [[1010000, 0], [1009900, 0], [1009500, 0], [1009000, 0]]
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

        const worldsEndScores: WorldsEndScoreList[] = [
            {
                8001: [1000000, 0],
                8002: [1002000, 0],
                8003: [1004000, 0]
            }, {
                8001: [1002000, 0],
                8002: [1004000, 0],
                8003: [1000000, 0]
            }, {
                8001: [1004000, 0],
                8002: [1000000, 0],
                8003: [1002000, 0]
            }
        ];

        await Promise.all([
                    ...playerRates.map((rate, index) =>
                                            setPlayer(String(index), `player${index}`, rate, rate, "", 14, 13)),
                    ...scores.map((score, index) => setScores(String(index), score)),
                    ...worldsEndScores.map((score, index) => setWorldsEndScores(String(index), score)),
                    createSong(1, "Radetzky Marsch", 20, 50, 80, 110, 1000, "RMVideo", "RMImage", 0),
                    createSong(2, "RAGE OF DUST", 30, 60, 90, 120, 1500, "RDVideo", "RDImage", 1),
                    createSong(3, "BE MY BABY", 40, 70, 100, 130, 2000, "BMBVideo", "BMBImage", 2),
                    createWorldsEndSong(8001, "Radetzky Marsch「弾」", 1, 3, 2000, "WERMVideo", "WERMImage"),
                    createWorldsEndSong(8002, "RAGE OF DUST「光」", 2, 4, 3000, "WERDVideo", "WERDImage"),
                    createWorldsEndSong(8003, "BE MY BABY「狂」", 3, 5, 4000, "WEBMBVideo", "WEBMBImage"),
                ]);

        await cacheDifficulty();
    });

    afterAll(() => {
        return Promise.all([
                    knex("songs").del(),
                    knex("scores").del(),
                    knex("players").del(),
                    knex("difficulty").del(),
                    knex("groupmembers").del(),
                    knex("users").del(),
                    knex("worldsendsongs").del(),
                    knex("worldsendscores").del()
                ]);
    });

    test("ping", () => {
        return expect(executeCommand("ping p1, p2", {}))
                .resolves
                .toMatchObject(["pong", "p1", "p2"]);
    });

    test("border", () => {
        return expect(Promise.all([
                    executeCommand("border R, 1007500", {}),
                    executeCommand("border Q, 1007500", {}),
                    executeCommand("border Rage, 1007500", {}),
                    executeCommand("border 2000, SSS", {}),
                ]))
                .resolves
                .toMatchObject([
                    [
                        "曲が絞り切れませんでした。以下より該当の曲を選び、その真下のコマンドを入力してください。\n",
                        "Radetzky Marsch\nborder /1, 1007500\n",
                        "RAGE OF DUST\nborder /2, 1007500\n"
                    ],
                    [
                        "曲が見つかりませんでした。"
                    ],
                    [
                        "RAGE OF DUST",
                        "18-7",
                        "69-6",
                        "120-5",
                        "171-4",
                        "222-3",
                        "273-2",
                        "324-1",
                        "375-0"
                    ],
                    [
                        "2000 notes",
                        "41-9",
                        "92-8",
                        "143-7",
                        "194-6",
                        "245-5",
                        "296-4",
                        "347-3",
                        "398-2",
                        "449-1",
                        "500-0"
                    ]
                ]);
    });

    test("help", () => {
        return expect(Promise.all([
                    executeCommand("help", {}),
                    executeCommand("help border", {}),
                    executeCommand("help command_that_doesnt_exist", {})
                ]))
                .resolves
                .toMatchObject([
                    [
                        "help コマンド名",
                        "指定されたコマンドのヘルプを表示します。",
                        "コマンド名にlistを指定した場合、コマンドリストを表示します。",
                        "各コマンドのヘルプの1行目はコマンドの使用法です。",
                        "[]で囲まれた部分は省略することが出来ます。"
                    ],
                    [
                        "border 曲名,スコア",
                        "指定された曲で指定された以上のスコアのために出せる最大のJUSTICE-ATTACK数を表示します。"
                    ],
                    [
                        "Error: ",
                        "コマンドが見つかりませんでした。"
                    ]
                ]);
    });

    test("difficulty", () => {
        return expect(Promise.all([
                    executeCommand("difficulty R, 1007500", {}),
                    executeCommand("difficulty Q, 1007500", {}),
                    executeCommand("difficulty Rage, 1007500", {})
                ]))
                .resolves
                .toMatchObject([
                    [
                        "曲が絞り切れませんでした。以下より該当の曲を選び、その真下のコマンドを入力してください。\n",
                        "Radetzky Marsch\ndifficulty /1, 1007500\n",
                        "RAGE OF DUST\ndifficulty /2, 1007500\n"
                    ],
                    [
                        "曲が見つかりませんでした。"
                    ],
                    [
                        "RAGE OF DUST",
                        "15.25"
                    ]
                ]);
    });

    test("info", () => {
        return expect(Promise.all([
                    executeCommand("info R", {}),
                    executeCommand("info Q", {}),
                    executeCommand("info Rage", {})
                ]))
                .resolves
                .toMatchObject([
                    [
                        "曲が絞り切れませんでした。以下より該当の曲を選び、その真下のコマンドを入力してください。\n",
                        "Radetzky Marsch\ninfo /1\n",
                        "RAGE OF DUST\ninfo /2\n"
                    ],
                    [
                        "曲が見つかりませんでした。"
                    ],
                    [
                        "RAGE OF DUST",
                        "MASTER: 12.0",
                        "1500 notes",
                        "EXPERT: 9.0",
                        "0 notes",
                        "ADVANCED: 6.0",
                        "0 notes",
                        "BASIC: 3.0",
                        "0 notes",
                    ]
                ]);
    });

    test("mybest", () => {
        return expect(Promise.all([
                    executeCommand("mybest R",  {}),
                    executeCommand("mybest R",  {playerId: "0"}),
                    executeCommand("mybest Q",  {playerId: "0"}),
                    executeCommand("mybest /3", {playerId: "0"})
                ]))
                .resolves
                .toMatchObject([
                    [
                        "Error: ",
                        "プレイヤーデータを登録してからご利用ください。"
                    ],
                    [
                        "曲が絞り切れませんでした。以下より該当の曲を選び、その真下のコマンドを入力してください。\n",
                        "Radetzky Marsch\nmybest /1\n",
                        "RAGE OF DUST\nmybest /2\n"
                    ],
                    [
                        "曲が見つかりませんでした。"
                    ],
                    [
                        "BE MY BABY",
                        "MASTER: 1009000",
                        "EXPERT: 1009500",
                        "ADVANCED: 1009900",
                        "BASIC: 1010000",
                    ]
                ]);
    });

    test("profile", () => {
        return expect(Promise.all([
                    executeCommand("profile",  {}),
                    executeCommand("profile",  {playerId: "0"})
                ]))
                .resolves
                .toMatchObject([
                    [
                        "Error: ",
                        "プレイヤーデータを登録してからご利用ください。"
                    ],
                    [
                        "player0",
                        "RATE: 15.00 / 15.00",
                        "BEST: 2.2800",
                        "RECENT: 53.1600",
                        "EMBLEM: V (IV-belt)"
                    ]
                ]);
    });

    test("rank", async () => {
        expect.assertions(4);

        await expect(executeCommand("rank join",  {playerId: "0", groupId: "g"}))
                .resolves
                .toMatchObject(["グループに参加しました。"]);

        await expect(Promise.all([
                    executeCommand("rank join",  {}),
                    executeCommand("rank join",  {playerId: "0"}),
                    executeCommand("rank join",  {playerId: "0", groupId: "g"}),
                    executeCommand("rank R",  {playerId: "0", groupId: "g"}),
                    executeCommand("rank Q",  {playerId: "0", groupId: "g"}),
                    executeCommand("rank /3", {playerId: "0", groupId: "g"}),
                    executeCommand("rank BE, exp", {playerId: "0", groupId: "g"})
                ]))
                .resolves
                .toMatchObject([
                    [
                        "Error: ",
                        "プレイヤーデータを登録してからご利用ください。"
                    ],
                    [
                        "Error: ",
                        "グループ内でご利用ください。"
                    ],
                    ["グループに既に参加しています。"],
                    [
                        "曲が絞り切れませんでした。以下より該当の曲を選び、その真下のコマンドを入力してください。\n",
                        "Radetzky Marsch\nrank /1\n",
                        "RAGE OF DUST\nrank /2\n"
                    ],
                    ["曲が見つかりませんでした。"],
                    [
                        "BE MY BABY",
                        "play: 1009000"
                    ],
                    [
                        "BE MY BABY",
                        "play: 1009500"
                    ]
                ]);

        await expect(executeCommand("rank leave",  {playerId: "0", groupId: "g"}))
                .resolves
                .toMatchObject(["グループから脱退しました。"]);

        await expect(executeCommand("rank leave",  {playerId: "0", groupId: "g"}))
                .resolves
                .toMatchObject(["このグループに所属していません。"]);
    });

    test("score", () => {
        return expect(Promise.all([
                    executeCommand("score R", {}),
                    executeCommand("score Q", {}),
                    executeCommand("score Rage", {})
                ]))
                .resolves
                .toMatchObject([
                    [
                        "曲が絞り切れませんでした。以下より該当の曲を選び、その真下のコマンドを入力してください。\n",
                        "Radetzky Marsch\nscore /1\n",
                        "RAGE OF DUST\nscore /2\n"
                    ],
                    [
                        "曲が見つかりませんでした。"
                    ],
                    [
                        "RAGE OF DUST",
                        "動画: RDVideo",
                        "画像: RDImage"
                    ]
                ]);
    });

    test("songs", () => {
        return expect(Promise.all([
                    executeCommand("songs v11", {}),
                    executeCommand("songs v11", {playerId: "0"}),
                    executeCommand("songs d13-", {playerId: "0"}),
                    executeCommand("songs s1007000-v-12", {playerId: "0"}),
                    executeCommand("songs c0", {playerId: "0"}),
                ]))
                .resolves
                .toMatchObject([
                    [
                        "Error: ",
                        "プレイヤーデータを登録してからご利用ください。"
                    ],
                    [
                        "Radetzky Marsch"
                    ],
                    [
                        "BE MY BABY"
                    ],
                    [
                        "RAGE OF DUST"
                    ],
                    []
                ]);
    });

    test("register", async () => {
        expect.assertions(3);

        await expect(Promise.all([
                    executeCommand("register user,  password", {}),
                    executeCommand("register user!, password", {playerId: "0"}),
                    executeCommand("register user,  password！", {playerId: "0"}),
                    executeCommand("register user,  password", {playerId: "0"})
                ]))
                .resolves
                .toMatchObject([
                    [
                        "Error: ",
                        "プレイヤーデータを登録してからご利用ください。"
                    ],
                    [
                        "ユーザーIDが無効な文字を含んでいます。"
                    ],
                    [
                        "パスワードが無効な文字を含んでいます。"
                    ],
                    [
                        "登録に成功しました。"
                    ]
                ]);

        await expect(executeCommand("register user, password", {playerId: "0"}))
                .resolves
                .toMatchObject(["ユーザー名は既に使用されています。"]);

        await expect(executeCommand("register user2, password", {playerId: "0"}))
                .resolves
                .toMatchObject(["登録に成功しました。"]);
    });

    test("werank", async () => {
        expect.assertions(4);

        await expect(executeCommand("werank join",  {playerId: "0", groupId: "g"}))
                .resolves
                .toMatchObject(["グループに参加しました。"]);

        await expect(Promise.all([
                    executeCommand("werank join",  {}),
                    executeCommand("werank join",  {playerId: "0"}),
                    executeCommand("werank join",  {playerId: "0", groupId: "g"}),
                    executeCommand("werank R",  {playerId: "0", groupId: "g"}),
                    executeCommand("werank Q",  {playerId: "0", groupId: "g"}),
                    executeCommand("werank /8003", {playerId: "0", groupId: "g"})
                ]))
                .resolves
                .toMatchObject([
                    [
                        "Error: ",
                        "プレイヤーデータを登録してからご利用ください。"
                    ],
                    [
                        "Error: ",
                        "グループ内でご利用ください。"
                    ],
                    ["グループに既に参加しています。"],
                    [
                        "曲が絞り切れませんでした。以下より該当の曲を選び、その真下のコマンドを入力してください。\n",
                        "Radetzky Marsch「弾」\nwerank /8001\n",
                        "RAGE OF DUST「光」\nwerank /8002\n"
                    ],
                    ["曲が見つかりませんでした。"],
                    [
                        "BE MY BABY「狂」",
                        "play: 1004000"
                    ]
                ]);

        await expect(executeCommand("werank leave",  {playerId: "0", groupId: "g"}))
                .resolves
                .toMatchObject(["グループから脱退しました。"]);

        await expect(executeCommand("werank leave",  {playerId: "0", groupId: "g"}))
                .resolves
                .toMatchObject(["このグループに所属していません。"]);
    });

    test("mybest", () => {
        return expect(Promise.all([
                    executeCommand("wemybest R",  {}),
                    executeCommand("wemybest R",  {playerId: "0"}),
                    executeCommand("wemybest Q",  {playerId: "0"}),
                    executeCommand("wemybest /8003", {playerId: "0"})
                ]))
                .resolves
                .toMatchObject([
                    [
                        "Error: ",
                        "プレイヤーデータを登録してからご利用ください。"
                    ],
                    [
                        "曲が絞り切れませんでした。以下より該当の曲を選び、その真下のコマンドを入力してください。\n",
                        "Radetzky Marsch「弾」\nwemybest /8001\n",
                        "RAGE OF DUST「光」\nwemybest /8002\n"
                    ],
                    [
                        "曲が見つかりませんでした。"
                    ],
                    [
                        "BE MY BABY「狂」: 1004000"
                    ]
                ]);
    });

    test("setscore", async () => {
        expect.assertions(2);

        await expect(Promise.all([
                    executeCommand("setscore R, 1009500",  {}),
                    executeCommand("setscore R, 1009500",  {playerId: "0"}),
                    executeCommand("setscore Q, 1009500",  {playerId: "0"}),
                    executeCommand("setscore /3, 1009500", {playerId: "0"}),
                    executeCommand("setscore /3, EXPERT, 1009900",  {playerId: "0"})
                ]))
                .resolves
                .toMatchObject([
                    [
                        "Error: ",
                        "プレイヤーデータを登録してからご利用ください。"
                    ],
                    [
                        "曲が絞り切れませんでした。以下より該当の曲を選び、その真下のコマンドを入力してください。\n",
                        "Radetzky Marsch\nsetscore /1, master, 1009500\n",
                        "RAGE OF DUST\nsetscore /2, master, 1009500\n"
                    ],
                    ["曲が見つかりませんでした。"],
                    [
                        "BE MY BABY: 1009500"
                    ],
                    [
                        "BE MY BABY: 1009900"
                    ]
                ]);

        await expect(executeCommand("mybest /3", {playerId: "0"}))
                .resolves
                .toMatchObject([
                    "BE MY BABY",
                    "MASTER: 1009500",
                    "EXPERT: 1009900",
                    "ADVANCED: 1009900",
                    "BASIC: 1010000"
                ]);
    });
});
