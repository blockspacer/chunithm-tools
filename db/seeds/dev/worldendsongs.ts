import * as Knex from "knex";
import {createWorldsEndSong} from "../../../src/controllers/worldsendsongs";

export async function seed(knex: Knex): Promise<any> {
    await knex("worldsendsongs").del();
    await createWorldsEndSong(8001, "WSong1", 1, 3, 3000, "score", "score");
    await createWorldsEndSong(8002, "WSong2", 2, 4, 4000, "score", "score");
}
