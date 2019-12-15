import * as Formatter from "../../src/helper/formatter";

describe("フォーマット関数", () => {
    test("スコア文字列から整数への変換", () => {
        expect([
                Formatter.scoreToInteger("SSS"),
                Formatter.scoreToInteger("S+"),
                Formatter.scoreToInteger("1007500"),
                Formatter.scoreToInteger("1006"),
                Formatter.scoreToInteger("9960"),
                Formatter.scoreToInteger("1002k"),
            ])
            .toMatchObject([
                1007500,
                990000,
                1007500,
                1006000,
                1009960,
                1002000
            ]);
    });

    test("整数からレートへの変換", () => {
        expect([
                Formatter.integerToRate(1234),
                Formatter.integerToRate(100)
            ])
            .toMatchObject([
                "12.34",
                "1.00"
            ]);
    });

    test("整数から譜面定数への変換", () => {
        expect([
                Formatter.integerToRateValue(124),
                Formatter.integerToRateValue(10),
                Formatter.integerToRateValue(130)
            ])
            .toMatchObject([
                "12.4",
                "1.0",
                "13.0"
            ]);
    });

    test("譜面定数から整数への変換", () => {
        expect([
                Formatter.rateValueToInteger("12.3"),
                Formatter.rateValueToInteger("14")
            ])
            .toMatchObject([
                123,
                140
            ]);
    });

    test("難易度から整数範囲への変換", () => {
        expect([
                Formatter.levelToInteger("12"),
                Formatter.levelToInteger("13+")
            ])
            .toMatchObject([
                {min: 120, max: 126},
                {min: 137, max: 139}
            ]);
    });

    test("難易度または譜面定数から整数範囲への変換", () => {
        expect([
                Formatter.difficultyToInteger("12"),
                Formatter.difficultyToInteger("13+"),
                Formatter.difficultyToInteger("13.5")
            ])
            .toMatchObject([
                {min: 120, max: 126},
                {min: 137, max: 139},
                {min: 135, max: 135}
            ]);
    });

    test("整数からスコアランプへの変換", () => {
        expect([
                Formatter.integerToScoreMark(0),
                Formatter.integerToScoreMark(2),
                Formatter.integerToScoreMark(4),
                Formatter.integerToScoreMark(6)
            ])
            .toMatchObject([
                "",
                "AJ",
                "FCFC",
                ""
            ]);
    });
});
