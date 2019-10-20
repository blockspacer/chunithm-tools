import {knex, onDuplicateKey} from "../knex_wrapper";
import {Difference} from "../models/difference";
import {Difficulty} from "../models/difficulty";
import {Genre} from "../models/genre";
import {History} from "../models/history";
import {HistoryList} from "../models/history_list";
import {Score} from "../models/score";
import {ScoreList} from "../models/score_list";

function constructScore(row: {[key: string]: string | number}): Score {
    return {
        song: {
            songId: Number(row.songid),
            songName: String(row.songname),
            difficulty: Number(row.difficulty),
            rateValue: Number(row.ratevalue),
            notes: Number(row.notes),
            scoreVideo: String(row.scorevideourl),
            scoreImage: String(row.scoreimageurl),
            genreId: Number(row.genreid)
        },
        score: Number(row.score),
        mark: Number(row.mark)
    };
}

type Options = {
    songId?: number,
    minScore?: number,
    maxScore?: number,
    minRateValue?: number,
    maxRateValue?: number,
    difficulty?: Difficulty,
    genre?: Genre
};

export async function getScores(playerId: string, options: Options): Promise<Score[]> {
    const rows = await knex("scores")
                        .innerJoin("songs", function() {
                            this.on("songs.songid", "scores.songid");
                            this.andOn("songs.difficulty", "scores.difficulty");
                        })
                        .select(
                            "songs.songid",
                            "songs.songname",
                            "songs.difficulty",
                            "songs.ratevalue",
                            "songs.notes",
                            "songs.scorevideourl",
                            "songs.scoreimageurl",
                            "songs.genreid",
                            "scores.score",
                            "scores.mark")
                        .where(function() {
                            this.andWhere("scores.playerid", playerId);
                            this.andWhereBetween(
                                "scores.score",
                                [options.minScore || 1, options.maxScore || 1010000]);
                            this.andWhereBetween(
                                "songs.ratevalue",
                                [options.minRateValue || 0, options.maxRateValue || 999]);

                            if (options.difficulty) {
                                this.andWhere("scores.difficulty", options.difficulty);
                            }

                            if (options.genre) {
                                this.andWhere("scores.genre", options.genre);
                            }

                            if (options.songId) {
                                this.andWhere("songs.songid", options.songId);
                            }
                        })
                        .orderBy([
                            {column: "songs.songid", order: "asc"},
                            {column: "songs.difficulty", order: "asc"}
                        ]);

    return rows.map((row) => constructScore(row));
}

export async function setScores(playerId: string, scores: ScoreList) {
    const difficulties = [Difficulty.BASIC, Difficulty.ADVANCED, Difficulty.EXPERT, Difficulty.MASTER];

    const trx = await knex.transaction();

    for (const songId in scores) {
        if (scores.hasOwnProperty(songId)) {
            for (const difficulty of difficulties) {
                await onDuplicateKey(
                    "scores",
                    {
                        playerid: playerId,
                        songid: Number(songId),
                        difficulty
                    }, {
                        score: scores[Number(songId)][difficulty][0],
                        mark: scores[Number(songId)][difficulty][1]
                    },
                    trx
                );
            }
        }
    }

    await trx.commit();
}

export async function getDifference(playerId: string): Promise<Difference[]> {
    const rows = await knex("differences")
                        .innerJoin("songs", function() {
                            this.on("differences.songid", "songs.songid");
                            this.andOn("differences.difficulty", "songs.difficulty");
                        })
                        .select(
                            "songs.songid",
                            "songs.songname",
                            "songs.difficulty",
                            "songs.ratevalue",
                            "songs.notes",
                            "songs.scorevideourl",
                            "songs.scoreimageurl",
                            "songs.genreid",
                            "differences.difficulty",
                            "differences.oldscore",
                            "differences.newscore")
                        .where({
                            playerid: playerId
                        })
                        .orderBy([
                            {column: "songs.songid", order: "asc"},
                            {column: "songs.difficulty", order: "asc"}
                        ]);

    return rows.map((row) => ({
        song: {
            songId: Number(row.songid),
            songName: String(row.songname),
            difficulty: Number(row.difficulty),
            rateValue: Number(row.ratevalue),
            notes: Number(row.notes),
            scoreVideo: String(row.scorevideourl),
            scoreImage: String(row.scoreimageurl),
            genreId: Number(row.genreid)
        },
        oldScore: Number(row.oldscore),
        newScore: Number(row.newscore)
    }));
}

export async function setDifference(playerId: string, scores: ScoreList) {
    const difficulties = [Difficulty.BASIC, Difficulty.ADVANCED, Difficulty.EXPERT, Difficulty.MASTER];

    const trx = await knex.transaction();

    await trx("differences")
            .delete()
            .where({playerid: playerId});

    await trx("differences")
            .insert(function(this: any) {
                this.select(
                        "playerid",
                        "songid",
                        "difficulty",
                        "score",
                        "score"
                    )
                    .from("scores")
                    .where({
                        playerid: playerId
                    });
            });

    for (const songId in scores) {
        if (scores.hasOwnProperty(songId)) {
            for (const difficulty of difficulties) {
                await onDuplicateKey(
                    "differences",
                    {
                        playerid: playerId,
                        songid: Number(songId),
                        difficulty,
                        oldscore: 0
                    }, {
                        newscore: scores[Number(songId)][difficulty][0]
                    },
                    trx
                );
            }
        }
    }

    await trx.commit();

    await knex("differences")
            .delete()
            .where(knex.raw("newscore <= oldscore"));
}

export async function setHistories(playerId: string, history: HistoryList) {
    history.sort((a, b) => {
        if (a.time > b.time) {
            return 1;
        }

        if (a.time < b.time) {
            return -1;
        }

        return 0;
    });

    let lastTime = "1970-01-01 00:00";

    const rows = await knex("histories")
                        .select("time")
                        .where({
                            playerid: playerId
                        })
                        .orderBy("time", "desc")
                        .limit(1);

    if (rows.length > 0) {
        lastTime = rows[0].time;
    }

    const trx = await knex.transaction();

    for (const score of history) {
        if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(score.time)) {
            continue;
        }

        if (score.time > lastTime) {
            await trx("histories")
                    .insert({
                        playerid: playerId,
                        songname: score.songName,
                        difficulty: score.difficulty,
                        time: score.time,
                        score: score.score
                    });

            lastTime = score.time;
        }
    }

    await trx.commit();
}

export async function getHistories(playerId: string, count: number): Promise<History[]> {
    const rows = await knex("histories")
                        .innerJoin("songs", function() {
                            this.on("histories.songname", "songs.songname");
                            this.andOn("histories.difficulty", "songs.difficulty");
                        })
                        .select(
                            "songs.songid",
                            "songs.songname",
                            "songs.difficulty",
                            "songs.ratevalue",
                            "songs.notes",
                            "songs.scorevideourl",
                            "songs.scoreimageurl",
                            "songs.genreid",
                            "histories.time",
                            "histories.score")
                        .where({
                            playerid: playerId
                        })
                        .orderBy("time", "desc")
                        .limit(count);

    return rows.map((row) => ({
        song: {
            songId: Number(row.songid),
            songName: String(row.songname),
            difficulty: Number(row.difficulty),
            rateValue: Number(row.ratevalue),
            notes: Number(row.notes),
            scoreVideo: String(row.scorevideourl),
            scoreImage: String(row.scoreimageurl),
            genreId: Number(row.genreid)
        },
        time: String(row.time),
        score: Number(row.score)
    }));
}

export async function statistics(songId: number, borders: Array<[string, number]>) {
    const scores = await knex("score")
                        .select("score")
                        .where("songid", songId)
                        .andWhere("difficulty", Difficulty.MASTER)
                        .andWhereBetween("score", [0, 1010000])
                        .orderBy("score", "desc");

    const count = Array.from({length: borders.length}).map(() => 0);
    let index = 0;

    for (const score of scores) {
        while (score.score > borders[index][1]) {
            index++;
        }
        count[index]++;
    }

    return count;
}
