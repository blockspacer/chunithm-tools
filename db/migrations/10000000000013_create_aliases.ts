import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
    const hasTable = await knex.schema.hasTable("aliases");

    if (!hasTable) {
        return knex.schema.createTable("aliases", (t) => {
            t.string("alias", 64).primary();
            t.integer("songid");
        });
    }

    return new Error("Table 'aliases' already exists");
}

export async function down(knex: Knex): Promise<any> {
    const hasTable = await knex.schema.hasTable("aliases");

    if (hasTable) {
        return knex.schema.dropTable("aliases");
    }
}
