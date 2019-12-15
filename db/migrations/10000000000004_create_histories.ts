import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
    const hasTable = await knex.schema.hasTable("histories");

    if (!hasTable) {
        return knex.schema.createTable("histories", (t) => {
            t.string("playerid", 64);
            t.string("songname");
            t.integer("difficulty");
            t.increments("number");
            t.string("time");
            t.integer("score");
        });
    }

    return new Error("Table 'histories' already exists");
}

export async function down(knex: Knex): Promise<any> {
    const hasTable = await knex.schema.hasTable("histories");

    if (hasTable) {
        return knex.schema.dropTable("histories");
    }
}
