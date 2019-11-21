import {scoreToInteger} from "../../src/helper/formatter";

describe("フォーマット関数", () => {
    test("スコア文字列から整数への変換", () => {
        expect([
                scoreToInteger("1007500"),
                scoreToInteger("1006"),
                scoreToInteger("9960"),
                scoreToInteger("1002k"),
            ])
            .toMatchObject([
                1007500,
                1006000,
                1009960,
                1002000
            ]);
    });
});
