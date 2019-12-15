import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
    const hasTable = await knex.schema.hasTable("differences");

    if (!hasTable) {
        return knex.schema.createTable("differences", (t) => {
            t.string("playerid", 64);
            t.integer("songid");
            t.integer("difficulty");
            t.integer("oldscore");
            t.integer("newscore");
            t.primary(["playerid", "songid", "difficulty"]);
        });
    }

    return new Error("Table 'differences' already exists");
}

export async function down(knex: Knex): Promise<any> {
    const hasTable = await knex.schema.hasTable("differences");

    if (hasTable) {
        return knex.schema.dropTable("differences");
    }
}
