import {validateHistoryList} from "../src/models/history_list";
import {validateScoreList} from "../src/models/score_list";

describe("モデルのバリデート", () => {
    test("ScoreListモデル", () => {
        expect([
                validateScoreList({}),
                validateScoreList({
                    1: [[0, 0], [0, 0], [0, 0], [0, 0]],
                    3: [[0, 0], [0, 0], [0, 0], [0, 0]]
                }),
                validateScoreList({
                    1: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
                    3: [[0, 0], [0, 0], [0, 0], [0, 0]]
                } as any),
                validateScoreList({
                    1: [[0, 0], [0, 0], [0, 0], [0, 0, 0]],
                    3: [[0, 0], [0, 0], [0, 0], [0, 0]]
                } as any),
                validateScoreList({
                    1: [[0, 0], [0, 0], [0, 0], [0, "0"]],
                    3: [[0, 0], [0, 0], [0, 0], [0, 0]]
                } as any),
            ])
            .toMatchObject([
                true,
                true,
                false,
                false,
                false
            ]);
    });

    test("HistoryListモデル", () => {
        expect([
                validateHistoryList([]),
                validateHistoryList([
                    {songName: "name", difficulty: 0, time: "", score: 0},
                    {songName: "name", difficulty: 0, time: "", score: 0}
                ]),
                validateHistoryList([
                    {difficulty: 0, time: "", score: 0}
                ] as any),
            ])
            .toMatchObject([
                true,
                true,
                false
            ]);
    });
});
