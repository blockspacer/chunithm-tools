import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
    const hasTable = await knex.schema.hasTable("difficulty");

    if (!hasTable) {
        return knex.schema.createTable("difficulty", (t) => {
            t.integer("songid");
            t.integer("rate");
            t.integer("score");
            t.primary(["songid", "rate"]);
        });
    }

    return new Error("Table 'difficulty' already exists");
}

export async function down(knex: Knex): Promise<any> {
    const hasTable = await knex.schema.hasTable("difficulty");

    if (hasTable) {
        return knex.schema.dropTable("difficulty");
    }
}
