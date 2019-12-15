import * as Config from "./config";

Config.loadConfig(process.cwd() + "/config/config.json");
const config = Config.getConfig();

export const development = {
    client: "mysql",
    connection: {
        port: config.dbPort,
        host: config.dbHost,
        database: config.dbName + "_dev",
        user: config.dbUser,
        password: config.dbPassword
    },
    pool: {
        min: 2,
        max: 10
    },
    migrations: {
        directory: "./db/migrations",
        tableName: "knex_migrations"
    },
    seeds: {
        directory: "./db/seeds/dev",
    }
};

export const production = {
    client: "mysql",
    connection: {
        port: config.dbPort,
        host: config.dbHost,
        database: config.dbName,
        user: config.dbUser,
        password: config.dbPassword
    },
    pool: {
        min: 2,
        max: 10
    },
    migrations: {
        directory: "./db/migrations",
        tableName: "knex_migrations"
    }
};

export const test = {
    client: "mysql",
    connection: {
        port: config.dbPort,
        host: config.dbHost,
        database: config.dbName + "_test",
        user: config.dbUser,
        password: config.dbPassword
    },
    pool: {
        min: 2,
        max: 10
    },
    migrations: {
        directory: "./db/migrations",
        tableName: "knex_migrations"
    },
    seeds: {
        directory: "./db/seeds/test",
    }
};
