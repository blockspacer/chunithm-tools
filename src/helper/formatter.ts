export function scoreToInteger(score: string) {
    const rates: {[key: string]: number} = {
        "SSS": 1007500,
        "SS+": 1005000,
        "SS" : 1000000,
        "S+" : 990000,
        "S"  : 975000,
        "AAA": 950000,
        "AA" : 925000,
        "A"  : 900000
    };

    if (score in rates) {
        return rates[score];
    }

    const integerScore = parseInt(score, 10);

    if (integerScore <= 1010) {
        return integerScore * 1000;
    }

    if (integerScore <= 9999) {
        return integerScore + 1000000;
    }

    return integerScore;
}

export function integerToRate(rate: number) {
    return String(Math.floor(rate / 100)) + "." + ("0" + String(rate % 100)).slice(-2);
}

export function integerToRateValue(rateValue: number) {
    return String(Math.floor(rateValue / 10)) + "." + String(rateValue % 10);
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

export function integerToScoreMark(scoreMark: number) {
    const marks = ["", "FC", "AJ", "FC", "FCFC", "AJFC"];
    return marks[scoreMark] || "";
}
