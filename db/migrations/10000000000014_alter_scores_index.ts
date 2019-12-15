import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
    const hasTable = await knex.schema.hasTable("scores");

    if (hasTable) {
        return knex.schema.alterTable("scores", (t) => {
            t.index(["songid", "difficulty"], "scoresindex");
        });
    }

    return new Error("Table 'scores' doesn't exist");
}

export async function down(knex: Knex): Promise<any> {
    const hasTable = await knex.schema.hasTable("scores");

    if (hasTable) {
        return knex.schema.alterTable("scores", (t) => {
            t.dropIndex(["songid", "difficulty"], "scoresindex");
        });
    }
}
