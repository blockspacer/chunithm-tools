import * as fs from "fs";

export type Config = {
    port: number,
    dbHost: string,
    dbPort: number,
    dbName: string,
    dbUser: string,
    dbPassword: string,
    line: {
        secret: string,
        accessToken: string
    },
    lineLogin: {
        clientId: string,
        clientSecret: string
    },
    twitter: {
        consumerKey: string,
        consumerSecret: string
    }
};

let config: Config | null = null;

export function loadConfig(fileName: string): boolean {
    try {
        const settingString: string = fs.readFileSync(fileName).toString("utf-8");
        const settings: Config = JSON.parse(settingString);

        if (
            typeof settings.port === "number" &&
            typeof settings.dbHost === "string" &&
            typeof settings.dbPort === "number" &&
            typeof settings.dbName === "string" &&
            typeof settings.dbUser === "string" &&
            typeof settings.dbPassword === "string" &&
            typeof settings.line === "object" &&
            typeof settings.line.secret === "string" &&
            typeof settings.line.accessToken === "string" &&
            typeof settings.lineLogin === "object" &&
            typeof settings.lineLogin.clientId === "string" &&
            typeof settings.lineLogin.clientSecret === "string" &&
            typeof settings.twitter === "object" &&
            typeof settings.twitter.consumerKey === "string" &&
            typeof settings.twitter.consumerSecret === "string"
        ) {
            config = settings;
            Object.freeze(config);

            return true;
        }

        return false;
    } catch (err) {
        if (err.code === "ENOENT") {
            return false;
        }

        throw err;
    }
}

export function getConfig() {
    if (!config) {
        throw new Error("Configは読み込まれていません。");
    }

    return config;
}
