import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
    const hasTable = await knex.schema.hasTable("users");

    if (!hasTable) {
        return knex.schema.createTable("users", (t) => {
            t.string("userid", 64).primary();
            t.string("password");
            t.string("playerid");
        });
    }

    return new Error("Table 'users' already exists");
}

export async function down(knex: Knex): Promise<any> {
    const hasTable = await knex.schema.hasTable("users");

    if (hasTable) {
        return knex.schema.dropTable("users");
    }
}
