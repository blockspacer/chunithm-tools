import {cacheDifficulty} from "../src/controllers/difficulty";
import {setPlayer} from "../src/controllers/players";
import {setScores} from "../src/controllers/scores";
import {createSong} from "../src/controllers/songs";
import {knex} from "../src/knex_wrapper";
import {ScoreList} from "../src/models/score_list";
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

        await Promise.all([
                    ...playerRates.map((rate, index) =>
                                            setPlayer(String(index), `player${index}`, rate, rate, "", 14, 13)),
                    ...scores.map((score, index) => setScores(String(index), score)),
                    createSong(1, "Radetzky Marsch", 20, 50, 80, 110, 1000, "RMVideo", "RMImage", 0),
                    createSong(2, "RAGE OF DUST", 30, 60, 90, 120, 1500, "RDVideo", "RDImage", 1),
                    createSong(3, "BE MY BABY", 40, 70, 100, 130, 2000, "BMBVideo", "BMBImage", 2)
                ]);

        await cacheDifficulty();
    });

    afterAll(() => {
        return Promise.all([
                    knex("songs").del(),
                    knex("scores").del(),
                    knex("players").del(),
                    knex("difficulty").del()
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
});
