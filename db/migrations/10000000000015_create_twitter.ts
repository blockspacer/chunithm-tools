import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
    const hasTable = await knex.schema.hasTable("twitter");

    if (!hasTable) {
        return knex.schema.createTable("twitter", (t) => {
            t.string("token", 64).primary();
            t.string("accesstoken");
            t.string("secret");
            t.string("userid");
            t.string("playerid");
        });
    }

    return new Error("Table 'twitter' already exists");
}

export async function down(knex: Knex): Promise<any> {
    const hasTable = await knex.schema.hasTable("twitter");

    if (hasTable) {
        return knex.schema.dropTable("twitter");
    }
}
