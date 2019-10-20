import { calcRate } from "../../src/helper/calculator";

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
});
