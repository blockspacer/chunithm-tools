import {knex} from "../knex_wrapper";
import {Genre} from "../models/genre";
import {Song} from "../models/song";

export async function createSong(
    songId: number,
    songName: string,
    basicRateValue: number,
    advancedRateValue: number,
    expertRateValue: number,
    masterRateValue: number,
    masterNotes: number,
    masterScoreVideo: string,
    masterScoreImage: string,
    genreId: Genre
) {
    await knex("songs")
        .insert([
            {
                songid: songId,
                songname: songName,
                basic: basicRateValue,
                advanced: advancedRateValue,
                expert: expertRateValue,
                master: masterRateValue,
                notes: masterNotes,
                scorevideourl: masterScoreVideo,
                scoreimageurl: masterScoreImage,
                genreid: genreId
            }
        ]);
}

export async function songExists(songId: number) {
    const rows = await knex("songs")
                        .count("songid as cnt")
                        .where("songid", songId);

    if (rows.length === 0) {
        return false;
    }

    return rows[0].cnt > 0;
}

function constructSong(row: {[key: string]: string | number}): Song {
    return {
        songId: Number(row.songid),
        songName: String(row.songname),
        basicRateValue: Number(row.basic),
        advancedRateValue: Number(row.advanced),
        expertRateValue: Number(row.expert),
        masterRateValue: Number(row.master),
        notes: Number(row.notes),
        scoreVideo: String(row.scorevideourl),
        scoreImage: String(row.scoreimageurl),
        genreId: Number(row.genreid)
    };
}

export async function searchSongsBySongId(query: string): Promise<Song[] | null> {
    if (query[0] !== "/") {
        return null;
    }

    const songId = Number(query.slice(1));

    const rows = await knex("songs")
                        .select(
                            "songid",
                            "songname",
                            "basic",
                            "advanced",
                            "expert",
                            "master",
                            "notes",
                            "scorevideourl",
                            "scoreimageurl",
                            "genreid")
                        .where("songid", songId);

    if (rows.length === 0) {
        return null;
    }

    return rows.map((row) => constructSong(row));
}

export async function searchSongsByExactSongName(query: string): Promise<Song[] | null> {
    const rows = await knex("songs")
                        .select(
                            "songid",
                            "songname",
                            "basic",
                            "advanced",
                            "expert",
                            "master",
                            "notes",
                            "scorevideourl",
                            "scoreimageurl",
                            "genreid")
                        .where("songname", query);

    if (rows.length === 0) {
        return null;
    }

    return rows.map((row) => constructSong(row));
}

export async function searchSongsBySongName(query: string): Promise<Song[] | null> {
    const rows = await knex("songs")
                        .select(
                            "songid",
                            "songname",
                            "basic",
                            "advanced",
                            "expert",
                            "master",
                            "notes",
                            "scorevideourl",
                            "scoreimageurl",
                            "genreid")
                        .where("songname", "like", `%${query}%`);

    if (rows.length === 0) {
        return null;
    }

    return rows.map((row) => constructSong(row));
}

export async function searchSongs(query: string): Promise<Song[]> {
    if (query === "") {
        return [];
    }

    return await searchSongsBySongId(query)
        || await searchSongsByExactSongName(query)
        || await searchSongsBySongName(query)
        || [];
}

export async function randomSongs(
    minRateValue: number,
    maxRateValue: number,
    count: number
) {
    const rows = await knex("songs")
                        .select(
                            "songid",
                            "songname",
                            "basic",
                            "advanced",
                            "expert",
                            "master",
                            "notes",
                            "scorevideourl",
                            "scoreimageurl",
                            "genreid")
                        .andWhereBetween("master", [minRateValue, maxRateValue])
                        .orderByRaw("RAND()")
                        .limit(count);

    return rows.map((row) => constructSong(row));
}
