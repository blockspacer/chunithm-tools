import {knex, onDuplicateKey} from "../knex_wrapper";
import {WorldsEndScore} from "../models/worldsendscore";
import {WorldsEndScoreList} from "../models/worldsendscore_list";

function constructWorldsEndScore(row: {[key: string]: string | number}): WorldsEndScore {
    return {
        song: {
            songId: Number(row.songid),
            songName: String(row.songname),
            parentSongId: Number(row.parentsongid),
            difficulty: Number(row.difficulty),
            notes: Number(row.notes),
            scoreVideo: String(row.scorevideourl),
            scoreImage: String(row.scoreimageurl)
        },
        score: Number(row.score),
        mark: Number(row.mark)
    };
}

type Options = {
    songId?: number,
    minScore?: number,
    maxScore?: number
};

export async function getWorldsEndScores(playerId: string, options: Options): Promise<WorldsEndScore[]> {
    const rows = await knex("worldsendscores")
                        .innerJoin("worldsendsongs", "worldsendsongs.songid", "worldsendscores.songid")
                        .select(
                            "worldsendsongs.songid",
                            "worldsendsongs.songname",
                            "worldsendsongs.parentsongid",
                            "worldsendsongs.difficulty",
                            "worldsendsongs.notes",
                            "worldsendsongs.scorevideourl",
                            "worldsendsongs.scoreimageurl",
                            "worldsendscores.score",
                            "worldsendscores.mark")
                        .where(function() {
                            this.andWhere("worldsendscores.playerid", playerId);
                            this.andWhereBetween(
                                "worldsendscores.score",
                                [options.minScore || 1, options.maxScore || 1010000]);

                            if (options.songId) {
                                this.andWhere("worldsendsongs.songid", options.songId);
                            }
                        })
                        .orderBy([
                            {column: "worldsendsongs.songid", order: "asc"},
                            {column: "worldsendsongs.difficulty", order: "asc"}
                        ]);

    return rows.map((row) => constructWorldsEndScore(row));
}

export async function setWorldsEndScores(playerId: string, scores: WorldsEndScoreList) {
    const trx = await knex.transaction();

    try {
        for (const songId in scores) {
            if (scores.hasOwnProperty(songId)) {
                await onDuplicateKey(
                    "worldsendscores",
                    {
                        playerid: playerId,
                        songid: Number(songId),
                    }, {
                        score: scores[Number(songId)][0],
                        mark: scores[Number(songId)][1]
                    },
                    trx
                );
            }
        }
        await trx.commit();
    } catch (err) {
        await trx.rollback();
        throw err;
    }
}

export async function setSingleWorldsEndScore(playerId: string, songId: number, score: number) {
    await onDuplicateKey(
        "worldsendscores",
        {
            playerid: playerId,
            songid: songId
        }, {
            score,
            mark: 0
        }
    );
}
