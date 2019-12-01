import {createSong} from "../src/controllers/songs";
import {knex} from "../src/knex_wrapper";
import {executeCommand} from "../src/shell";

describe("シェル", () => {
    beforeAll(() => {
        return Promise.all([
                    createSong(1, "Radetzky Marsch", 20, 50, 80, 110, 1000, "RMVideo", "RMImage", 0),
                    createSong(2, "RAGE OF DUST", 30, 60, 90, 120, 1500, "RDVideo", "RDImage", 1),
                    createSong(3, "BE MY BABY", 40, 70, 100, 130, 2000, "BMBVideo", "BMBImage", 2)
                ]);
    });

    afterAll(() => {
        return Promise.all([
                    knex("songs").del()
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
});
