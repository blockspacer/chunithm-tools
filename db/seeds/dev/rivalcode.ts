import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
    await knex("rivalcode").del();
    await knex("rivalcode").insert([
        {
            playerid: "player1",
            rivalcode: "p1"
        },
        {
            playerid: "player2",
            rivalcode: "p2"
        }
    ]);
}
