import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
    await knex("worldsendscores").del();
    await knex("worldsendscores").insert([
        {playerid: "player1", songid: 8001, score: 1005000, mark: 0},
        {playerid: "player1", songid: 8002, score: 1006000, mark: 0},
        {playerid: "player2", songid: 8001, score: 1008000, mark: 0},
        {playerid: "player2", songid: 8002, score: 1007000, mark: 0},
    ]);
}
