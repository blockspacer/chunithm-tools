// Update with your config settings.

module.exports = {
    development: {
        client: "mysql",
        connection: {
            port: 3306,
            host: "",
            database: "chunithm_tools",
            user: "",
            password: ""
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
            directory: "./db/seeds",
        },
    },

    staging: {
        client: "mysql",
        connection: {
            port: 3306,
            host: "",
            database: "chunithm_tools",
            user: "",
            password: ""
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
            directory: "./db/seeds",
        },
    },

    production: {
        client: "mysql",
        connection: {
            port: 3306,
            host: "",
            database: "chunithm_tools",
            user: "",
            password: ""
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
            directory: "./db/seeds",
        },
    }
};
