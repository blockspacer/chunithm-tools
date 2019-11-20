import * as Knex from "knex";
import {Difficulty} from "../../../src/models/difficulty";

export async function seed(knex: Knex): Promise<any> {
    await knex("differences").del();
    await knex("differences").insert([
        {playerid: "player1", songid: 1, difficulty: Difficulty.BASIC,    oldscore: 0, newscore: 1008000},
        {playerid: "player1", songid: 1, difficulty: Difficulty.ADVANCED, oldscore: 0, newscore: 1007000},
        {playerid: "player1", songid: 1, difficulty: Difficulty.EXPERT,   oldscore: 0, newscore: 1006000},
        {playerid: "player1", songid: 1, difficulty: Difficulty.MASTER,   oldscore: 0, newscore: 1005000},
        {playerid: "player1", songid: 2, difficulty: Difficulty.BASIC,    oldscore: 0, newscore: 1006000},
        {playerid: "player1", songid: 2, difficulty: Difficulty.ADVANCED, oldscore: 0, newscore: 1005000},
        {playerid: "player1", songid: 2, difficulty: Difficulty.EXPERT,   oldscore: 0, newscore: 1004000},
        {playerid: "player1", songid: 2, difficulty: Difficulty.MASTER,   oldscore: 0, newscore: 1003000},
        {playerid: "player2", songid: 1, difficulty: Difficulty.BASIC,    oldscore: 0, newscore: 1009000},
        {playerid: "player2", songid: 1, difficulty: Difficulty.ADVANCED, oldscore: 0, newscore: 1008000},
        {playerid: "player2", songid: 1, difficulty: Difficulty.EXPERT,   oldscore: 0, newscore: 1007000},
        {playerid: "player2", songid: 1, difficulty: Difficulty.MASTER,   oldscore: 0, newscore: 1006000},
    ]);
}
