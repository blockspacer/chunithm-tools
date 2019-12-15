import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
    const hasTable = await knex.schema.hasTable("worldsendscores");

    if (!hasTable) {
        return knex.schema.createTable("worldsendscores", (t) => {
            t.string("playerid", 64);
            t.integer("songid");
            t.integer("score");
            t.integer("mark");
            t.primary(["playerid", "songid"]);
        });
    }

    return new Error("Table 'worldsendscores' already exists");
}

export async function down(knex: Knex): Promise<any> {
    const hasTable = await knex.schema.hasTable("worldsendscores");

    if (hasTable) {
        return knex.schema.dropTable("worldsendscores");
    }
}
