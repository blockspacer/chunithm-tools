import {difficultyToInteger, integerToRate, levelToInteger, rateValueToInteger, scoreToInteger} from "../../src/helper/formatter";

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

    test("整数からレートへの変換", () => {
        expect([
                integerToRate(1234),
                integerToRate(100)
            ])
            .toMatchObject([
                "12.34",
                "1.00"
            ]);
    });

    test("譜面定数から整数への変換", () => {
        expect([
                rateValueToInteger("12.3"),
                rateValueToInteger("14")
            ])
            .toMatchObject([
                123,
                140
            ]);
    });

    test("難易度から整数範囲への変換", () => {
        expect([
                levelToInteger("12"),
                levelToInteger("13+")
            ])
            .toMatchObject([
                {min: 120, max: 126},
                {min: 137, max: 139}
            ]);
    });

    test("難易度または譜面定数から整数範囲への変換", () => {
        expect([
                difficultyToInteger("12"),
                difficultyToInteger("13+"),
                difficultyToInteger("13.5")
            ])
            .toMatchObject([
                {min: 120, max: 126},
                {min: 137, max: 139},
                {min: 135, max: 135}
            ]);
    });
});
