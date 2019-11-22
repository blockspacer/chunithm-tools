import {knex, onDuplicateKey} from "../knex_wrapper";
import {Difficulty} from "../models/difficulty";
import {Recommend} from "../models/recommend";

export async function cacheDifficulty() {
    const songIdList = (await knex("songs")
                                .select("songid")
                                .where("difficulty", Difficulty.MASTER))
                            .map((row) => Number(row.songid));

    const ratesCount = (await knex("players")
                                .select("maxrate")
                                .count("maxrate as cnt")
                                .where("maxrate", ">=", 1300)
                                .groupBy("maxrate"))
                            .reduce<{[key: number]: number}>(
                                (count, row) => {
                                    count[Number(row.maxrate)] = Number(row.cnt);
                                    return count;
                                },
                                {});

    const ratesCountSum = Object.keys(ratesCount).reduce((sum, key) => sum + ratesCount[Number(key)], 0);

    for (const songId of songIdList) {
        let countSum = 0;
        const scores = await knex("scores")
                                .select("score")
                                .where("songid", songId)
                                .andWhere("difficulty", Difficulty.MASTER)
                                .andWhereBetween("score", [900000, 1010000])
                                .orderBy("score", "desc");
        const scoresCount = scores.length;

        if (scoresCount === 0) {
            continue;
        }

        for (let rate = 1600; rate >= 1300; rate--) {
            if (!(rate in ratesCount)) {
                continue;
            }
            countSum += ratesCount[rate];
            const position = Math.ceil(countSum / ratesCountSum * scoresCount) - 1;
            const score = Number(scores[position].score);
            await onDuplicateKey(
                "difficulty",
                {
                    songid: songId,
                    rate
                }, {
                    score
                }
            );
        }
    }
}

export async function getDifficulty(songId: number, score: number) {
    const rows = await knex("difficulty")
                        .select("rate")
                        .where("songid", songId)
                        .andWhere("score", "<=", score)
                        .orderBy("rate", "desc")
                        .limit(1);

    if (rows.length > 0) {
        return Number(rows[0].rate);
    }

    return 1298;
}

type Options = {
    count?: number,
    minRateValue?: number,
    maxRateValue?: number
};

export async function getRecommend(playerId: string, options: Options = {}): Promise<Recommend[]> {
    const rows = await knex("songs")
                        .innerJoin("scores", function() {
                            this.on("songs.difficulty", "scores.difficulty");
                            this.andOn("songs.songid", "scores.songid");
                        })
                        .innerJoin("difficulty", "songs.songid", "difficulty.songid")
                        .select(
                            "songs.songid",
                            "songs.songname",
                            "songs.difficulty",
                            "songs.ratevalue",
                            "songs.notes",
                            "songs.scorevideourl",
                            "songs.scoreimageurl",
                            "songs.genreid")
                        .max("difficulty.rate as rate")
                        .where("scores.playerid", playerId)
                        .andWhere("songs.difficulty", Difficulty.MASTER)
                        .andWhereRaw("scores.score >= difficulty.score")
                        .andWhereBetween("songs.ratevalue", [options.minRateValue || 10, options.maxRateValue || 160])
                        .groupBy(
                            "songs.songid",
                            "songs.songname",
                            "songs.difficulty",
                            "songs.ratevalue",
                            "songs.notes",
                            "songs.scorevideourl",
                            "songs.scoreimageurl",
                            "songs.genreid")
                        .orderByRaw(
                            "max(rate) " + (
                                options.count
                                ? options.count >= 0 ? "asc" : "desc"
                                : "asc"))
                        .limit(Math.abs(options.count || 999));

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
        rate: Number(row.rate)
    }));
}
