import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
    await knex("difficulty").del();
    await knex("difficulty").insert([
        {songid: 1, rate: 1550, score: 1008000},
        {songid: 1, rate: 1525, score: 1007000},
        {songid: 1, rate: 1500, score: 1006000},
        {songid: 2, rate: 1550, score: 1009000},
        {songid: 2, rate: 1525, score: 1008000},
        {songid: 2, rate: 1500, score: 1007000},
        {songid: 3, rate: 1550, score: 1007000},
        {songid: 3, rate: 1525, score: 1006000},
        {songid: 3, rate: 1500, score: 1005000}
    ]);
}
