export type Player = {
    playerName: string,
    currentRate: number,
    maxRate: number,
    title: string,
    emblemTop: number,
    emblemBase: number
};

export function validatePlayer(player: Player) {
    return (
        typeof player.playerName === "string"
        && typeof player.currentRate === "number"
        && typeof player.maxRate === "number"
        && typeof player.title === "string"
        && typeof player.emblemTop === "number"
        && typeof player.emblemBase === "number"
    );
}
