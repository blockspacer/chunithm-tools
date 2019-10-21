import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
    const hasTable = await knex.schema.hasTable("groupmembers");

    if (!hasTable) {
        return knex.schema.createTable("groupmembers", (t) => {
            t.string("groupid", 64);
            t.string("playerid", 64);
            t.primary(["groupid", "playerid"]);
        });
    }

    return new Error("Table 'groupmembers' already exists");
}

export async function down(knex: Knex): Promise<any> {
    const hasTable = await knex.schema.hasTable("groupmembers");

    if (hasTable) {
        return knex.schema.dropTable("groupmembers");
    }
}
