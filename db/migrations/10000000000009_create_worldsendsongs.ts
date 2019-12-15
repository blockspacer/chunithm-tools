import * as Knex from "knex";

export async function up(knex: Knex): Promise<any> {
    const hasTable = await knex.schema.hasTable("worldsendsongs");

    if (!hasTable) {
        return knex.schema.createTable("worldsendsongs", (t) => {
            t.integer("songid");
            t.string("songname");
            t.integer("parentsongid");
            t.integer("difficulty");
            t.integer("notes");
            t.string("scorevideourl");
            t.string("scoreimageurl");
            t.primary(["songid"]);
        });
    }

    return new Error("Table 'worldsendsongs' already exists");
}

export async function down(knex: Knex): Promise<any> {
    const hasTable = await knex.schema.hasTable("worldsendsongs");

    if (hasTable) {
        return knex.schema.dropTable("worldsendsongs");
    }
}
