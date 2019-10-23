export type ScoreList = {
    [key: number]: [
        [number, number],
        [number, number],
        [number, number],
        [number, number],
    ]
};

export function validateScoreList(scoreList: ScoreList) {
    for (const songId of Object.keys(scoreList)) {
        if (Number.isNaN(Number(songId))) {
            return false;
        }

        if (scoreList[Number(songId)].length !== 4) {
            return false;
        }

        const isAppropriate = scoreList[Number(songId)].reduce<boolean>(
            (prev, score) => prev
                          && score.length === 2
                          && typeof score[0] === "number"
                          && typeof score[1] === "number",
            true
        );

        if (!isAppropriate) {
            return false;
        }
    }

    return true;
}
