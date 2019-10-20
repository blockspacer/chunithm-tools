import {knex, onDuplicateKey} from "../knex_wrapper";
import {Difficulty} from "../models/difficulty";

export async function cacheDifficulty() {
    const songIdList = (await knex("songs")
                                .select("songid"))
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
