import {calcBorder, calcRate} from "../../src/helper/calculator";

describe("計算関数", () => {
    test("曲別レート", () => {
        expect([
                calcRate(130, 1008000),
                calcRate(120, 1007500),
                calcRate(125, 1005000),
                calcRate(120, 1000000),
                calcRate(125, 975000),
            ])
            .toMatchObject([
                1500,
                1400,
                1400,
                1300,
                1250
            ]);
    });

    test("ボーダー算出", () => {
        expect([
            calcBorder(2000, 1009900),
            calcBorder(2000, 1009500),
            calcBorder(2000, 1005000),
            ])
            .toMatchObject([
                [
                    {justice: 20, attack: 0}
                ], [
                    {justice: 49, attack: 1},
                    {justice: 100, attack: 0}
                ], [
                    {justice: 31, attack: 19},
                    {justice: 82, attack: 18},
                    {justice: 133, attack: 17},
                    {justice: 184, attack: 16},
                    {justice: 235, attack: 15},
                    {justice: 286, attack: 14},
                    {justice: 337, attack: 13},
                    {justice: 388, attack: 12},
                    {justice: 439, attack: 11},
                    {justice: 490, attack: 10}
                ]
            ]);
    });
});
