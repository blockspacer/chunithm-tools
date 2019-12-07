import * as Knex from "knex";
import {createUser} from "../../../src/controllers/users";

export async function seed(knex: Knex): Promise<any> {
    await knex("users").del();
    await createUser("neko",   "password1", "player1");
    await createUser("hotate", "password2", "player2");
}
