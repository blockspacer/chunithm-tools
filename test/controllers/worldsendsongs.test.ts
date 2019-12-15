import * as WorldsEndSongs from "../../src/controllers/worldsendsongs";
import {knex} from "../../src/knex_wrapper";

describe("ワールズエンド曲データの取り扱い", () => {
    afterAll(() => {
        return knex("worldsendsongs").del();
    });

    test("曲の作成", () => {
        return expect(Promise.all([
                    WorldsEndSongs.createWorldsEndSong(8001, "Radetzky Marsch", 1, 1, 1000, "WRMVideo", "WRMImage"),
                    WorldsEndSongs.createWorldsEndSong(8002, "RAGE OF DUST", 2, 2, 2000, "WRDVideo", "WRDImage"),
                    WorldsEndSongs.createWorldsEndSong(8003, "BE MY BABY", 3, 3, 3000, "WBMBVideo", "WBMBImage")
                ]))
            .resolves
            .not.toThrowError();
    });

    test("曲の検索", () => {
        return expect(Promise.all([
                    WorldsEndSongs.searchWorldsEndSongs("Radetzky Marsch"),
                    WorldsEndSongs.searchWorldsEndSongs("Ra"),
                    WorldsEndSongs.searchWorldsEndSongs("xqx")
                ]))
            .resolves
            .toMatchObject([
                [
                    {
                        songId: 8001,
                        songName: "Radetzky Marsch",
                        difficulty: 1,
                        notes: 1000,
                        scoreVideo: "WRMVideo",
                        scoreImage: "WRMImage"
                    }
                ], [
                    {
                        songId: 8001,
                        songName: "Radetzky Marsch",
                        difficulty: 1,
                        notes: 1000,
                        scoreVideo: "WRMVideo",
                        scoreImage: "WRMImage"
                    }, {
                        songId: 8002,
                        songName: "RAGE OF DUST",
                        difficulty: 2,
                        notes: 2000,
                        scoreVideo: "WRDVideo",
                        scoreImage: "WRDImage"
                    }
                ], []
            ]);
    });

    test("曲の存在の確認", () => {
        return expect(Promise.all([
                    WorldsEndSongs.WorldsEndSongExists(8001),
                    WorldsEndSongs.WorldsEndSongExists(8004)
                ]))
            .resolves
            .toMatchObject([
                true,
                false
            ]);
    });

    test("ランダム選曲", () => {
        return expect(WorldsEndSongs.randomWorldsEndSongs(2))
            .resolves
            .toHaveLength(2);
    });
});
