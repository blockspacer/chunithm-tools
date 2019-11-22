import * as Knex from "knex";

export async function seed(knex: Knex): Promise<any> {
    await knex("ratelog").del();
    await knex("ratelog").insert([
        {
            playerid: "player1",
            recorddate: "2019-01-01",
            currentrate: 1501,
            maxrate: 1501
        }, {
            playerid: "player1",
            recorddate: "2019-01-02",
            currentrate: 1500,
            maxrate: 1505
        }, {
            playerid: "player2",
            recorddate: "2019-01-01",
            currentrate: 1400,
            maxrate: 1405
        }
    ]);
}
