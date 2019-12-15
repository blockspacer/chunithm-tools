import * as Config from "../../src/config";

describe("設定", () => {
    test("設定ファイルの読み込み", () => {
        expect(Config.loadConfig(process.cwd() + "/config/config.example.json"))
            .toBe(true);
    });

    test("不正な設定ファイルの除外", () => {
        expect(Config.loadConfig(process.cwd() + "/test/config/bad_config.json"))
            .toBe(false);
    });

    test("設定の取得", () => {
        expect(Config.getConfig())
            .toMatchObject({
                port: 8000,
                dbHost: "localhost",
                dbPort: 3306,
                dbName: "chunithm_tools",
                dbUser: "username",
                dbPassword: "password",
                line: {
                    accessToken: "token",
                    secret: "secret"
                },
                lineLogin: {
                    clientId: "id",
                    clientSecret: "loginSecret"
                },
                twitter: {
                    consumerKey: "key",
                    consumerSecret: "twSecret"
                }
            });
    });
});
