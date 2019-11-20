import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
    await knex("players").del();
    await knex("players").insert([
        {
            playerid: "player1",
            playername: "neko",
            currentrate: 1500,
            maxrate: 1505,
            title: "NEW COMER",
            emblemtop: 13,
            emblembase: 13
        }, {
            playerid: "player2",
            playername: "hotate",
            currentrate: 1400,
            maxrate: 1405,
            title: "NEW COMER",
            emblemtop: 10,
            emblembase: 0
        }
    ]);
}
