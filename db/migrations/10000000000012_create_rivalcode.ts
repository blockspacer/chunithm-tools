import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
    const hasTable = await knex.schema.hasTable("rivalcode");

    if (!hasTable) {
        return knex.schema.createTable("rivalcode", (t) => {
            t.string("playerid", 64).primary();
            t.string("rivalcode");
        });
    }

    return new Error("Table 'rivalcode' already exists");
}

export async function down(knex: Knex): Promise<any> {
    const hasTable = await knex.schema.hasTable("rivalcode");

    if (hasTable) {
        return knex.schema.dropTable("rivalcode");
    }
}
