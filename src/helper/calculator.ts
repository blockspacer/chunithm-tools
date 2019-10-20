export function calcRate(rateValue: number, score: number): number {
    if (score >= 1007500) {
        return (rateValue * 10) + 200;
    }

    if (score >= 1005000) {
        return (score - 1005000) / 50 + (rateValue * 10) + 150;
    }

    if (score >= 1000000) {
        return (score - 1000000) / 100 + (rateValue * 10) + 100;
    }

    if (score >= 975000) {
        return (score - 975000) / 250 + (rateValue * 10);
    }

    if (score >= 950000) {
        return (score - 950000) / 250 * 1.5 + (rateValue * 10) - 150;
    }

    if (score >= 925000) {
        return (score - 925000) / 250 * 1.5 + (rateValue * 10) - 300;
    }

    if (score >= 900000) {
        return (score - 900000) / 125 + (rateValue * 10) - 500;
    }

    return 0;
}
