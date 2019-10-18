import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
    const hasTable = await knex.schema.hasTable("songs");

    if (!hasTable) {
        return knex.schema.createTable("songs", (t) => {
            t.integer("songid").primary();
            t.string("songname");
            t.integer("basic");
            t.integer("advanced");
            t.integer("expert");
            t.integer("master");
            t.integer("notes");
            t.string("scorevideourl");
            t.string("scoreimageurl");
            t.integer("genreid");
        });
    }

    return new Error("Table 'songs' already exists");
}

export async function down(knex: Knex): Promise<any> {
    const hasTable = await knex.schema.hasTable("songs");

    if (hasTable) {
        return knex.schema.dropTable("songs");
    }
}
