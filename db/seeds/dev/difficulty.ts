import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
    await knex("difficulty").del();
    await knex("difficulty").insert([
        {songid: 1, rate: 1550, score: 1008000},
        {songid: 1, rate: 1525, score: 1007000},
        {songid: 1, rate: 1500, score: 1006000},
        {songid: 1, rate: 1475, score: 1005000},
        {songid: 1, rate: 1450, score: 1004000},
        {songid: 1, rate: 1425, score: 1003000},
        {songid: 1, rate: 1400, score: 1002000},

        {songid: 2, rate: 1550, score: 1009000},
        {songid: 2, rate: 1525, score: 1008000},
        {songid: 2, rate: 1500, score: 1007000},
        {songid: 2, rate: 1475, score: 1006000},
        {songid: 2, rate: 1450, score: 1005000},
        {songid: 2, rate: 1425, score: 1004000},
        {songid: 2, rate: 1400, score: 1003000},

        {songid: 3, rate: 1550, score: 1007000},
        {songid: 3, rate: 1525, score: 1006000},
        {songid: 3, rate: 1500, score: 1005000},
        {songid: 3, rate: 1475, score: 1004000},
        {songid: 3, rate: 1450, score: 1003000},
        {songid: 3, rate: 1425, score: 1002000},
        {songid: 3, rate: 1400, score: 1001000}
    ]);
}
