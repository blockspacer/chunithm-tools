import * as Knex from "knex";
import {Difficulty} from "../../../src/models/difficulty";

export async function seed(knex: Knex): Promise<any> {
    await knex("scores").del();
    await knex("scores").insert([
        {playerid: "player1", songid: 1, difficulty: Difficulty.BASIC,    score: 1008000, mark: 0},
        {playerid: "player1", songid: 1, difficulty: Difficulty.ADVANCED, score: 1007000, mark: 0},
        {playerid: "player1", songid: 1, difficulty: Difficulty.EXPERT,   score: 1006000, mark: 0},
        {playerid: "player1", songid: 1, difficulty: Difficulty.MASTER,   score: 1005000, mark: 0},
        {playerid: "player1", songid: 2, difficulty: Difficulty.BASIC,    score: 1006000, mark: 0},
        {playerid: "player1", songid: 2, difficulty: Difficulty.ADVANCED, score: 1005000, mark: 0},
        {playerid: "player1", songid: 2, difficulty: Difficulty.EXPERT,   score: 1004000, mark: 0},
        {playerid: "player1", songid: 2, difficulty: Difficulty.MASTER,   score: 1003000, mark: 0},
        {playerid: "player2", songid: 1, difficulty: Difficulty.BASIC,    score: 1009000, mark: 0},
        {playerid: "player2", songid: 1, difficulty: Difficulty.ADVANCED, score: 1008000, mark: 0},
        {playerid: "player2", songid: 1, difficulty: Difficulty.EXPERT,   score: 1007000, mark: 0},
        {playerid: "player2", songid: 1, difficulty: Difficulty.MASTER,   score: 1006000, mark: 0},
    ]);
}
