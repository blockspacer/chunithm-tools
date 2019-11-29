import {executeCommand} from "../src/shell";

describe("シェル", () => {
    test("ping", () => {
        return expect(executeCommand("ping p1, p2", {}))
                .resolves
                .toMatchObject(["pong", "p1", "p2"]);
    });
});
