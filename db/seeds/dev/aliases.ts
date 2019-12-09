import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
    await knex("aliases").del();
    await knex("aliases").insert([
        {alias: "one", songid: 1},
        {alias: "two", songid: 2}
    ]);
}
