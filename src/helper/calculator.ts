import {Border} from "../models/border";

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

export function calcBorder(notes: number, score: number): Border[] {
    const justice = Math.floor((1010000 - score) / (10000 / notes));
    const maxAttack = Math.floor(justice / 52);
    const borders: Border[] = [];

    for (let attack = maxAttack; attack >= maxAttack - 9 && attack >= 0; attack--) {
        borders.push({
            justice: justice - attack * 51,
            attack
        });
    }

    return borders;
}

export function calcScore(critical: number, justice: number, attack: number, miss: number) {
    const notes = critical + justice + attack + miss;
    return (critical * 101 + justice * 100 + attack * 50) * 10000 / notes;
}
