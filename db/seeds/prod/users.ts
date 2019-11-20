import * as Knex from "knex";
import {create} from "../../../src/controllers/users";

export async function seed(knex: Knex): Promise<any> {
    await knex("users").del();
    await create("neko",   "password1", "player1");
    await create("hotate", "password2", "player2");
}
