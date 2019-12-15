import {knex} from "../knex_wrapper";
import {WorldsEndSong} from "../models/worldsendsong";

export async function createWorldsEndSong(
    songId: number,
    songName: string,
    parentSongId: number,
    difficulty: number,
    notes: number,
    scoreVideo: string,
    scoreImage: string
) {
    await knex("worldsendsongs")
        .insert({
            songid: songId,
            songname: songName,
            parentsongid: parentSongId,
            difficulty,
            notes,
            scorevideourl: scoreVideo,
            scoreimageurl: scoreImage
        });
}

export async function WorldsEndSongExists(songId: number) {
    const rows = await knex("worldsendsongs")
                        .count("songid as cnt")
                        .where("songid", songId);

    if (rows.length === 0) {
        return false;
    }

    return rows[0].cnt > 0;
}

function constructWorldsEndSong(row: {[key: string]: string | number}): WorldsEndSong {
    return {
        songId: Number(row.songid),
        songName: String(row.songname),
        parentSongId: Number(row.parentsongid),
        difficulty: Number(row.difficulty),
        notes: Number(row.notes),
        scoreVideo: String(row.scorevideourl),
        scoreImage: String(row.scoreimageurl)
    };
}

export async function searchWorldsEndSongsBySongId(query: string): Promise<WorldsEndSong[] | null> {
    if (query[0] !== "/") {
        return null;
    }

    const songId = Number(query.slice(1));

    const rows = await knex("worldsendsongs")
                        .select(
                            "songid",
                            "songname",
                            "parentsongid",
                            "difficulty",
                            "notes",
                            "scorevideourl",
                            "scoreimageurl")
                        .where("songid", songId)
                        .orderBy("songid", "asc");

    if (rows.length === 0) {
        return null;
    }

    return rows.map((row) => constructWorldsEndSong(row));
}

export async function searchWorldsEndSongsByExactSongName(query: string): Promise<WorldsEndSong[] | null> {
    const rows = await knex("worldsendsongs")
                        .select(
                            "songid",
                            "songname",
                            "parentsongid",
                            "difficulty",
                            "notes",
                            "scorevideourl",
                            "scoreimageurl")
                        .where("songname", query)
                        .orderBy("songid", "asc");

    if (rows.length === 0) {
        return null;
    }

    return rows.map((row) => constructWorldsEndSong(row));
}

export async function searchWorldsEndSongsBySongName(query: string): Promise<WorldsEndSong[] | null> {
    const rows = await knex("worldsendsongs")
                        .select(
                            "songid",
                            "songname",
                            "parentsongid",
                            "difficulty",
                            "notes",
                            "scorevideourl",
                            "scoreimageurl")
                        .where("songname", "like", `%${query}%`)
                        .orderBy("songid", "asc");

    if (rows.length === 0) {
        return null;
    }

    return rows.map((row) => constructWorldsEndSong(row));
}

export async function searchWorldsEndSongs(query: string): Promise<WorldsEndSong[]> {
    if (query === "") {
        return [];
    }

    return await searchWorldsEndSongsBySongId(query)
        || await searchWorldsEndSongsByExactSongName(query)
        || await searchWorldsEndSongsBySongName(query)
        || [];
}

export async function randomWorldsEndSongs(
    count: number
) {
    const rows = await knex("worldsendsongs")
                        .select(
                            "songid",
                            "songname",
                            "parentsongid",
                            "difficulty",
                            "notes",
                            "scorevideourl",
                            "scoreimageurl")
                        .orderByRaw("RAND()")
                        .limit(count);

    return rows.map((row) => constructWorldsEndSong(row));
}
