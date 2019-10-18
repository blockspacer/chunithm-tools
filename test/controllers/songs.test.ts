import * as Songs from "../../src/controllers/songs";

describe("曲データの取り扱い", () => {
    test("曲の作成", () => {
        return expect(Promise.all([
                    Songs.createSong(1, "Radetzky Marsch", 20, 50, 80, 110, 1000, "RMVideo", "RMImage", 0),
                    Songs.createSong(2, "RAGE OF DUST", 30, 60, 90, 120, 1500, "RDVideo", "RDImage", 1),
                    Songs.createSong(3, "BE MY BABY", 40, 70, 100, 130, 2000, "BMBVideo", "BMBImage", 2)
                ]))
            .resolves
            .not.toThrowError();
    });

    test("曲の検索", () => {
        return expect(Promise.all([
                    Songs.searchSongs("Radetzky Marsch"),
                    Songs.searchSongs("Ra"),
                    Songs.searchSongs("xqx")
                ]))
            .resolves
            .toMatchObject([
                [{
                    songId: 1,
                    songName: "Radetzky Marsch",
                    basicRateValue: 20,
                    advancedRateValue: 50,
                    expertRateValue: 80,
                    masterRateValue: 110,
                    notes: 1000,
                    scoreVideo: "RMVideo",
                    scoreImage: "RMImage",
                    genreId: 0
                }], [{
                    songId: 1,
                    songName: "Radetzky Marsch",
                    basicRateValue: 20,
                    advancedRateValue: 50,
                    expertRateValue: 80,
                    masterRateValue: 110,
                    notes: 1000,
                    scoreVideo: "RMVideo",
                    scoreImage: "RMImage",
                    genreId: 0
                }, {
                    songId: 2,
                    songName: "RAGE OF DUST",
                    basicRateValue: 30,
                    advancedRateValue: 60,
                    expertRateValue: 90,
                    masterRateValue: 120,
                    notes: 1500,
                    scoreVideo: "RDVideo",
                    scoreImage: "RDImage",
                    genreId: 1
                }], []
            ]);
    });

    test("曲の存在の確認", () => {
        return expect(Promise.all([
                    Songs.songExists(1),
                    Songs.songExists(4)
                ]))
            .resolves
            .toMatchObject([
                true,
                false
            ]);
    });

    test("ランダム選曲", () => {
        return expect(Songs.randomSongs(3, 120, 130))
            .resolves
            .toHaveLength(2);
    });
});
