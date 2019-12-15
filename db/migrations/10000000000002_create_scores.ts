import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
    const hasTable = await knex.schema.hasTable("scores");

    if (!hasTable) {
        return knex.schema.createTable("scores", (t) => {
            t.string("playerid", 64);
            t.integer("songid");
            t.integer("difficulty");
            t.integer("score");
            t.integer("mark");
            t.primary(["playerid", "songid", "difficulty"]);
        });
    }

    return new Error("Table 'scores' already exists");
}

export async function down(knex: Knex): Promise<any> {
    const hasTable = await knex.schema.hasTable("scores");

    if (hasTable) {
        return knex.schema.dropTable("scores");
    }
}
