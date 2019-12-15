import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
    const hasTable = await knex.schema.hasTable("players");

    if (!hasTable) {
        return knex.schema.createTable("players", (t) => {
            t.string("playerid", 64);
            t.string("playername");
            t.integer("currentrate");
            t.integer("maxrate");
            t.string("title");
            t.integer("emblemtop");
            t.integer("emblembase");
            t.primary(["playerid"]);
        });
    }

    return new Error("Table 'players' already exists");
}

export async function down(knex: Knex): Promise<any> {
    const hasTable = await knex.schema.hasTable("players");

    if (hasTable) {
        return knex.schema.dropTable("players");
    }
}
