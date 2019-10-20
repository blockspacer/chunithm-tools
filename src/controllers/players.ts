import {knex, onDuplicateKey} from "../knex_wrapper";
import {Player} from "../models/player";
import {RateLog} from "../models/ratelog";

export async function getPlayer(playerId: string): Promise<Player> {
    const rows = await knex("players")
                        .select(
                            "playername",
                            "currentrate",
                            "maxrate",
                            "title",
                            "emblemtop",
                            "emblembase")
                        .where("playerid", playerId);

    if (rows.length === 0) {
        throw new Error("プレイヤーデータが存在しません。");
    }

    return {
        playerName: String(rows[0].playername),
        currentRate: Number(rows[0].currentrate),
        maxRate: Number(rows[0].maxrate),
        title: String(rows[0].title),
        emblemTop: Number(rows[0].emblemtop),
        emblemBase: Number(rows[0].emblembase)
    };
}

export async function setPlayer(
    playerId: string,
    playerName: string,
    currentRate: number,
    maxRate: number,
    title: string,
    emblemTop: number,
    emblemBase: number,
    recordDate: string
) {
    await onDuplicateKey(
        "players",
        {
            playerid: playerId
        }, {
            playername: playerName,
            currentrate: currentRate,
            maxrate: maxRate,
            title,
            emblemtop: emblemTop,
            emblembase: emblemBase
        }
    );

    await onDuplicateKey(
        "ratelog",
        {
            playerid: playerId,
            recorddate: recordDate
        }, {
            currentrate: currentRate,
            maxrate: maxRate
        }
    );
}

export async function playerExists(playerId: string) {
    const rows = await knex("players")
                        .count("playerid as cnt")
                        .where("playerid", playerId);

    if (rows.length === 0) {
        return false;
    }

    return rows[0].cnt > 0;
}

export async function getRateLog(playerId: string): Promise<RateLog[]> {
    const rows = await knex("ratelog")
                        .select(
                            "recorddate",
                            "currentrate",
                            "maxrate")
                        .where("playerid", playerId)
                        .orderBy("recorddate", "desc")
                        .limit(20);

    return rows.reverse().map((row) => ({
        date: String(row.recorddate),
        currentRate: Number(row.currentrate),
        maxRate: Number(row.maxrate)
    }));
}
