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

export function rateValueToInteger(rateValue: string) {
    const parts = rateValue.split(".", 2);
    if (parts.length === 1) {
        return parseInt(parts[0], 10) * 10;
    }
    const integer = parseInt(parts[0], 10);
    const fraction = parseInt((parts[1] + "0").slice(0, 1), 10);
    return integer * 10 + fraction;
}

export function levelToInteger(difficulty: string) {
    const integer = parseInt(difficulty, 10) * 10;
    return /\+$/.test(difficulty)
                    ? {min: integer + 7, max: integer + 9}
                    : {min: integer + 0, max: integer + 6};
}

export function difficultyToInteger(difficulty: string) {

    const isRateValue = /[0-9]\.[0-9]+$/.test(difficulty);

    const min = isRateValue
                    ? rateValueToInteger(difficulty)
                    : levelToInteger(difficulty).min;

    const max = isRateValue
                    ? rateValueToInteger(difficulty)
                    : levelToInteger(difficulty).max;

    return {min, max};
}
