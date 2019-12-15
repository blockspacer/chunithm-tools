export type WorldsEndScoreList = {
    [key: number]: [number, number]
};

export function validateWorldsEndScoreList(scoreList: WorldsEndScoreList) {
    for (const songId of Object.keys(scoreList)) {
        if (Number.isNaN(Number(songId))) {
            return false;
        }

        if (
            typeof scoreList[Number(songId)][0] !== "number"
            || typeof scoreList[Number(songId)][1] !== "number"
            || scoreList[Number(songId)].length !== 2
        ) {
            return false;
        }
    }

    return true;
}
