import {knex} from "../knex_wrapper";
import {Difficulty} from "../models/difficulty";
import {RankingScore} from "../models/ranking_score";
import {getBestSongs} from "./scores";

export async function joinGroup(groupId: string, playerId: string) {
    const rows = await knex("groupmembers")
                        .count("playerid as cnt")
                        .where({
                            groupid: groupId,
                            playerid: playerId
                        });

    if (rows.length === 0 || rows[0].cnt > 0) {
        return false;
    }

    await knex("groupmembers")
            .insert({
                groupid: groupId,
                playerid: playerId
            });

    return true;
}

export async function leaveGroup(groupId: string, playerId: string) {
    const rows = await knex("groupmembers")
                        .count("playerid as cnt")
                        .where({
                            groupid: groupId,
                            playerid: playerId
                        });

    if (rows.length === 0 || rows[0].cnt === 0) {
        return false;
    }

    await knex("groupmembers")
            .delete()
            .where({
                groupid: groupId,
                playerid: playerId
            });

    return true;
}

export async function totalRanking(groupId: string, difficulty: Difficulty): Promise<RankingScore[]> {
    const rows = await knex("scores")
                        .innerJoin("players", "scores.playerid", "players.playerid")
                        .innerJoin("groupmembers", "groupmembers.playerid", "players.playerid")
                        .select("players.playername")
                        .sum("score as score")
                        .where({
                            "groupmembers.groupid": groupId,
                            "scores.difficulty": difficulty
                        })
                        .groupBy("players.playerid")
                        .orderByRaw("sum(scores.score) desc");

    return rows.map((row) => ({
        playerName: String(row.playername),
        score: Number(row.score)
    }));
}

export async function songRanking(groupId: string, songId: number, difficulty: Difficulty): Promise<RankingScore[]> {
    const rows = await knex("scores")
                        .innerJoin("players", "scores.playerid", "players.playerid")
                        .innerJoin("groupmembers", "groupmembers.playerid", "players.playerid")
                        .select(
                            "players.playername",
                            "scores.score")
                        .where({
                            "groupmembers.groupid": groupId,
                            "scores.difficulty": difficulty,
                            "scores.songid": songId
                        })
                        .orderBy("scores.score", "desc");

    return rows.map((row) => ({
        playerName: String(row.playername),
        score: Number(row.score)
    }));
}

export async function worldsEndTotalRanking(groupId: string): Promise<RankingScore[]> {
    const rows = await knex("worldsendscores")
                        .innerJoin("players", "worldsendscores.playerid", "players.playerid")
                        .innerJoin("groupmembers", "groupmembers.playerid", "players.playerid")
                        .select("players.playername")
                        .sum("worldsendscores.score as score")
                        .where({
                            "groupmembers.groupid": groupId
                        })
                        .groupBy("players.playerid")
                        .orderByRaw("sum(worldsendscores.score) desc");

    return rows.map((row) => ({
        playerName: String(row.playername),
        score: Number(row.score)
    }));
}

export async function worldsEndSongRanking(groupId: string, songId: number): Promise<RankingScore[]> {
    const rows = await knex("worldsendscores")
                        .innerJoin("players", "worldsendscores.playerid", "players.playerid")
                        .innerJoin("groupmembers", "groupmembers.playerid", "players.playerid")
                        .select(
                            "players.playername",
                            "worldsendscores.score")
                        .where({
                            "groupmembers.groupid": groupId,
                            "worldsendscores.songid": songId
                        })
                        .orderBy("worldsendscores.score", "desc");

    return rows.map((row) => ({
        playerName: String(row.playername),
        score: Number(row.score)
    }));
}

export async function currentRateRanking(groupId: string): Promise<RankingScore[]> {
    const rows = await knex("players")
                        .innerJoin("groupmembers", "groupmembers.playerid", "players.playerid")
                        .select(
                            "players.playername",
                            "players.currentrate")
                        .where("groupmembers.groupid", groupId)
                        .orderBy("players.currentrate", "desc");

    return rows.map((row) => ({
        playerName: String(row.playername),
        score: Number(row.currentrate)
    }));
}

export async function maxRateRanking(groupId: string): Promise<RankingScore[]> {
    const rows = await knex("players")
                        .innerJoin("groupmembers", "groupmembers.playerid", "players.playerid")
                        .select(
                            "players.playername",
                            "players.maxrate")
                        .where("groupmembers.groupid", groupId)
                        .orderBy("maxrate", "desc");

    return rows.map((row) => ({
        playerName: String(row.playername),
        score: Number(row.maxrate)
    }));
}

export async function bestAverageRanking(groupId: string): Promise<RankingScore[]> {
    const rows = await knex("players")
                        .innerJoin("groupmembers", "groupmembers.playerid", "players.playerid")
                        .select(
                            "players.playername",
                            "players.playerid")
                        .where("groupmembers.groupid", groupId)
                        .orderBy("maxrate", "desc");

    const ranking = await Promise.all(rows.map(async (row) => {
        const best = (await getBestSongs(String(row.playerid))).slice(0, 30);
        const average = best.reduce((sum, song) => sum + song.rate, 0) / 30;
        return {
            playerName: String(row.playername),
            score: average
        } as RankingScore;
    }));

    return ranking.sort((a, b) => b.score - a.score);
}
