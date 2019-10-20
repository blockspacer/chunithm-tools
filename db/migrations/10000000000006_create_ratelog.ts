import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
    const hasTable = await knex.schema.hasTable("ratelog");

    if (!hasTable) {
        return knex.schema.createTable("ratelog", (t) => {
            t.string("playerid", 64);
            t.string("recorddate", 16);
            t.integer("currentrate");
            t.integer("maxrate");
            t.primary(["playerid", "recorddate"]);
        });
    }

    return new Error("Table 'ratelog' already exists");
}

export async function down(knex: Knex): Promise<any> {
    const hasTable = await knex.schema.hasTable("ratelog");

    if (hasTable) {
        return knex.schema.dropTable("ratelog");
    }
}
