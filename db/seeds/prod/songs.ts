import * as Knex from "knex";
import {createSong} from "../../../src/controllers/songs";
import {Genre} from "../../../src/models/genre";

export async function seed(knex: Knex): Promise<any> {
    await knex("songs").del();
    await createSong(1, "Song1", 30, 60, 90, 120, 1500, "score", "score", Genre.ORIGINAL);
    await createSong(2, "Song2", 40, 70, 100, 130, 1800, "score", "score", Genre.IRODORI);
}
