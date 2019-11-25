import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
    const hasTable = await knex.schema.hasTable("rivals");

    if (!hasTable) {
        return knex.schema.createTable("rivals", (t) => {
            t.string("playerid", 64);
            t.string("rival", 64);
            t.primary(["playerid", "rival"]);
        });
    }

    return new Error("Table 'rivals' already exists");
}

export async function down(knex: Knex): Promise<any> {
    const hasTable = await knex.schema.hasTable("rivals");

    if (hasTable) {
        return knex.schema.dropTable("rivals");
    }
}
