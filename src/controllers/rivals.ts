import {sha256} from "../helper/hash";
import {knex, onDuplicateKey} from "../knex_wrapper";
import {Difficulty} from "../models/difficulty";
import {RankingScore} from "../models/ranking_score";
import {Rival} from "../models/rival";
import {RivalDifference} from "../models/rival_difference";
import {ScoreList} from "../models/score_list";
import {getScores} from "./scores";
import {getAllSongs} from "./songs";

export async function issueRivalCode(playerId: string) {
    const code = sha256(String(Date.now()) + String(Math.random())).slice(0, 16);

    await onDuplicateKey("rivalcode", {
        playerid: playerId
    }, {
        rivalcode: code
    });

    return code;
}

export async function getRivalCode(playerId: string) {
    const rows = await knex("rivalcode")
                        .select("rivalcode")
                        .where("playerid", playerId);

    if (rows.length === 0) {
        return await issueRivalCode(playerId);
    }

    return rows[0].rivalcode;
}

export async function referenceRivalCode(rivalCode: string): Promise<string | null> {
    const rows = await knex("rivalcode")
                        .select("playerid")
                        .where("rivalcode", rivalCode);

    if (rows.length === 0) {
        return null;
    }

    return rows[0].playerid;
}

export async function addRival(playerId: string, rivalId: string) {
    const rows = await knex("rivals")
                        .select("rival")
                        .where({
                            playerid: playerId,
                            rival: rivalId
                        });

    if (rows.length > 0) {
        return false;
    }

    await onDuplicateKey("rivals", {
        playerid: playerId
    }, {
        rival: rivalId
    });

    return true;
}

export async function removeRival(playerId: string, rivalId: string) {
    const rows = await knex("rivals")
                        .select("rival")
                        .where({
                            playerid: playerId,
                            rival: rivalId
                        });

    if (rows.length === 0) {
        return false;
    }

    await knex("rivals")
            .delete()
            .where({
                playerid: playerId,
                rival: rivalId
            });

    return true;
}

export async function getRivals(playerId: string): Promise<Rival[]> {
    const rows = await knex("rivals")
                        .select(
                            "playername",
                            "currentrate",
                            "maxrate",
                            "title",
                            "emblemtop",
                            "emblembase",
                            "rivalcode")
                        .innerJoin("player", "player.playerid", "rivals.rival")
                        .innerJoin("rivalcode", "player.playerid", "rivalcode.playerid")
                        .where("rivals.playerid", playerId);

    return rows.map((row) => ({
        playerName: String(row.playername),
        currentRate: Number(row.currentrate),
        maxRate: Number(row.maxrate),
        title: String(row.title),
        emblemTop: Number(row.emblemtop),
        emblemBase: Number(row.emblembase),
        rivalCode: String(row.rivalcode)
    }));
}

export async function rivalRanking(playerId: string, songId: number, difficulty: Difficulty): Promise<RankingScore[]> {
    const rows = await knex("rivals")
                        .select(
                            "playername",
                            "score")
                        .innerJoin("players", function() {
                                this.on("players.playerid", "rivals.rival");
                                this.orOn(knex.raw(`players.playerid = '${playerId}'`));
                            })
                        .innerJoin("scores", "players.playerid", "scores.playerid")
                        .where("rivals.playerid", playerId)
                        .andWhere("scores.songid", songId)
                        .andWhere("scores.difficulty", difficulty)
                        .orderBy("scores.score", "desc");

    return rows.map((row) => ({
        playerName: String(row.playername),
        score: Number(row.score)
    }));
}

export async function compare(playerId: string, rivalId: string): Promise<RivalDifference[]> {
    const difficulties = [Difficulty.BASIC, Difficulty.ADVANCED, Difficulty.EXPERT, Difficulty.MASTER];

    const songs = await Promise.all(difficulties.map((dif) => getAllSongs(dif)));

    const myScores = (await getScores(playerId, {}))
                        .reduce<ScoreList>((acc, score) => {
                            if (!(score.song.songId in acc)) {
                                acc[score.song.songId] = [[0, 0], [0, 0], [0, 0], [0, 0]];
                            }
                            acc[score.song.songId][score.song.difficulty] = [score.score, score.mark];
                            return acc;
                        }, {});

    const rivalScores = (await getScores(rivalId, {}))
                            .reduce<ScoreList>((acc, score) => {
                                if (!(score.song.songId in acc)) {
                                    acc[score.song.songId] = [[0, 0], [0, 0], [0, 0], [0, 0]];
                                }
                                acc[score.song.songId][score.song.difficulty] = [score.score, score.mark];
                                return acc;
                            }, {});

    return songs.reduce<RivalDifference[]>((acc, xs) => {
        acc.push(...xs.map<RivalDifference>((song) => ({
            song,
            myScore: song.songId in myScores ? myScores[song.songId][song.difficulty][0] : 0,
            rivalScore: song.songId in rivalScores ? rivalScores[song.songId][song.difficulty][0] : 0
        })));
        return acc;
    }, []);
}
