import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
    await knex("rivals").del();
    await knex("rivals").insert([
        {
            playerid: "player1",
            rival: "player2"
        },
        {
            playerid: "player2",
            rival: "player1"
        }
    ]);
}
