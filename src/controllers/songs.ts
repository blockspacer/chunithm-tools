import {knex} from "../knex_wrapper";
import { Difficulty } from "../models/difficulty";
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
                difficulty: Difficulty.BASIC,
                ratevalue: basicRateValue,
                notes: 0,
                scorevideourl: "",
                scoreimageurl: "",
                genreid: genreId
            }, {
                songid: songId,
                songname: songName,
                difficulty: Difficulty.ADVANCED,
                ratevalue: advancedRateValue,
                notes: 0,
                scorevideourl: "",
                scoreimageurl: "",
                genreid: genreId
            }, {
                songid: songId,
                songname: songName,
                difficulty: Difficulty.EXPERT,
                ratevalue: expertRateValue,
                notes: 0,
                scorevideourl: "",
                scoreimageurl: "",
                genreid: genreId
            }, {
                songid: songId,
                songname: songName,
                difficulty: Difficulty.MASTER,
                ratevalue: masterRateValue,
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
        difficulty: Number(row.difficulty),
        rateValue: Number(row.ratevalue),
        notes: Number(row.notes),
        scoreVideo: String(row.scorevideourl),
        scoreImage: String(row.scoreimageurl),
        genreId: Number(row.genreid)
    };
}

export async function searchSongsBySongId(query: string, difficulty: Difficulty): Promise<Song[] | null> {
    if (query[0] !== "/") {
        return null;
    }

    const songId = Number(query.slice(1));

    const rows = await knex("songs")
                        .select(
                            "songid",
                            "songname",
                            "difficulty",
                            "ratevalue",
                            "notes",
                            "scorevideourl",
                            "scoreimageurl",
                            "genreid")
                        .where("songid", songId)
                        .andWhere("difficulty", difficulty)
                        .orderBy("songid", "asc");

    if (rows.length === 0) {
        return null;
    }

    return rows.map((row) => constructSong(row));
}

export async function createAlias(alias: string, songId: number): Promise<boolean> {
    const rows = await knex("aliases")
                        .count("alias as cnt")
                        .where("alias", alias);

    if (rows.length > 0 && rows[0].cnt > 0) {
        return false;
    }

    await knex("aliases")
            .insert({
                alias,
                songid: songId
            });

    return true;
}

export async function searchSongsByAlias(alias: string, difficulty: Difficulty): Promise<Song[] | null> {
    const rows = await knex("songs")
                        .innerJoin("aliases", "aliases.songid", "songs.songid")
                        .select(
                            "songs.songid",
                            "songs.songname",
                            "songs.difficulty",
                            "songs.ratevalue",
                            "songs.notes",
                            "songs.scorevideourl",
                            "songs.scoreimageurl",
                            "songs.genreid")
                        .where("aliases.alias", alias)
                        .andWhere("songs.difficulty", difficulty)
                        .orderBy("songs.songid", "asc");

    if (rows.length === 0) {
        return null;
    }

    return rows.map((row) => constructSong(row));
}

export async function searchSongsByExactSongName(query: string, difficulty: Difficulty): Promise<Song[] | null> {
    const rows = await knex("songs")
                        .select(
                            "songid",
                            "songname",
                            "difficulty",
                            "ratevalue",
                            "notes",
                            "scorevideourl",
                            "scoreimageurl",
                            "genreid")
                        .where("songname", query)
                        .andWhere("difficulty", difficulty)
                        .orderBy("songid", "asc");

    if (rows.length === 0) {
        return null;
    }

    return rows.map((row) => constructSong(row));
}

export async function searchSongsBySongName(query: string, difficulty: Difficulty): Promise<Song[] | null> {
    const rows = await knex("songs")
                        .select(
                            "songid",
                            "songname",
                            "difficulty",
                            "ratevalue",
                            "notes",
                            "scorevideourl",
                            "scoreimageurl",
                            "genreid")
                        .where("songname", "like", `%${query}%`)
                        .andWhere("difficulty", difficulty)
                        .orderBy("songid", "asc");

    if (rows.length === 0) {
        return null;
    }

    return rows.map((row) => constructSong(row));
}

type Options = {
    minScore?: number,
    maxScore?: number,
    minRateValue?: number,
    maxRateValue?: number,
    genre?: Genre
};

export async function getSongs(playerId: string, options: Options, difficulty: Difficulty): Promise<Song[]> {
    const songs = options.minScore || options.maxScore
                    ? knex("songs")
                        .innerJoin("scores", function() {
                            this.on("songs.songid", "scores.songid");
                            this.andOn("songs.difficulty", "scores.difficulty");
                        })
                    : knex("songs");

    const rows = await songs
                        .select(
                            "songs.songid",
                            "songs.songname",
                            "songs.difficulty",
                            "songs.ratevalue",
                            "songs.notes",
                            "songs.scorevideourl",
                            "songs.scoreimageurl",
                            "songs.genreid")
                        .where(function() {
                            if (options.minScore || options.maxScore) {
                                this.andWhere("scores.playerid", playerId);
                                this.andWhereBetween(
                                    "scores.score",
                                    [options.minScore || 0, options.maxScore || 1010000]);
                            }
                            if (options.minRateValue || options.maxRateValue) {
                                this.andWhereBetween(
                                    "songs.ratevalue",
                                    [options.minRateValue || 0, options.maxRateValue || 999]);
                            }

                            if (options.genre) {
                                this.andWhere("scores.genre", options.genre);
                            }
                        })
                        .andWhere("songs.difficulty", difficulty)
                        .orderBy([
                            {column: "songs.songid", order: "asc"},
                            {column: "songs.difficulty", order: "asc"}
                        ]);

    return rows.map((row) => constructSong(row));
}

export async function searchSongs(query: string, difficulty: Difficulty = Difficulty.MASTER): Promise<Song[]> {
    if (query === "") {
        return [];
    }

    return await searchSongsBySongId(query, difficulty)
        || await searchSongsByExactSongName(query, difficulty)
        || await searchSongsByAlias(query, difficulty)
        || await searchSongsBySongName(query, difficulty)
        || [];
}

export async function getSingleSong(songId: number) {
    const rows = await knex("songs")
                        .select(
                            "songid",
                            "songname",
                            "difficulty",
                            "ratevalue",
                            "notes",
                            "scorevideourl",
                            "scoreimageurl",
                            "genreid")
                        .where("songid", String(songId))
                        .orderBy("difficulty", "asc");

    return rows.map((row) => constructSong(row));
}

export async function getAllSongs(difficulty: Difficulty = Difficulty.MASTER): Promise<Song[]> {
    const rows = await knex("songs")
                        .select(
                            "songid",
                            "songname",
                            "difficulty",
                            "ratevalue",
                            "notes",
                            "scorevideourl",
                            "scoreimageurl",
                            "genreid")
                        .where("difficulty", difficulty)
                        .orderBy("songid", "asc");

    return rows.map((row) => constructSong(row));
}

export async function randomSongs(
    minRateValue: number,
    maxRateValue: number,
    count: number,
    difficulty: Difficulty = Difficulty.MASTER
) {
    const rows = await knex("songs")
                        .select(
                            "songid",
                            "songname",
                            "difficulty",
                            "ratevalue",
                            "notes",
                            "scorevideourl",
                            "scoreimageurl",
                            "genreid")
                        .whereBetween("ratevalue", [minRateValue, maxRateValue])
                        .andWhere("difficulty", difficulty)
                        .orderByRaw("RAND()")
                        .limit(count);

    return rows.map((row) => constructSong(row));
}
