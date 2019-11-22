import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
    await knex("histories").del();
    await knex("histories").insert([
        {time: "2019/01/01 15:00", playerid: "player1", songname: "song1", difficulty: 0, score: 1008000},
        {time: "2019/01/01 15:03", playerid: "player1", songname: "song1", difficulty: 1, score: 1007000},
        {time: "2019/01/01 15:06", playerid: "player1", songname: "song1", difficulty: 2, score: 1006000},
        {time: "2019/01/01 15:09", playerid: "player1", songname: "song1", difficulty: 3, score: 1005000},
        {time: "2019/01/01 15:12", playerid: "player1", songname: "song2", difficulty: 0, score: 1006000},
        {time: "2019/01/01 15:15", playerid: "player1", songname: "song2", difficulty: 1, score: 1005000},
        {time: "2019/01/01 15:18", playerid: "player1", songname: "song2", difficulty: 2, score: 1004000},
        {time: "2019/01/01 15:21", playerid: "player1", songname: "song2", difficulty: 3, score: 1003000}
    ]);
}
