export function scoreToInteger(score: string) {
    const integerScore = parseInt(score, 10);

    if (integerScore <= 1010) {
        return integerScore * 1000;
    }

    if (integerScore <= 9999) {
        return integerScore + 1000000;
    }

    return integerScore;
}
