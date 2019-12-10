import * as Knex from "knex";
import * as settings from "../src/knex_config";

const config = process.env.NODE_ENV === "production" ? settings.production :
               process.env.NODE_ENV === "test"       ? settings.test :
                                                       settings.development;

const knex = Knex(config);
config.connection.database = "chunithmtools";
const oldKnex = Knex(config);

async function players() {
    const rows = await oldKnex("PLAYER")
                        .select(
                            "PLAYERID",
                            "PLAYERNAME",
                            "MAXRATE",
                            "CURRENTRATE",
                            "TITLE",
                            "EMBLEMTOP",
                            "EMBLEMBASE");

    const trx = await knex.transaction();
    for (const row of rows) {
        await trx("players")
                .insert({
                    playerid: row["PLAYERID"],
                    playername: row["PLAYERNAME"],
                    maxrate: row["MAXRATE"],
                    currentrate: row["CURRENTRATE"],
                    title: row["TITLE"],
                    emblemtop: row["EMBLEM"],
                    emblembase: row["EMBLEMBASE"]
                });
    }
    await trx.commit();
}

async function aliases() {
    const rows = await oldKnex("ALIAS")
                        .select(
                            "ALIAS",
                            "SONGID");

    const trx = await knex.transaction();
    for (const row of rows) {
        await trx("aliases")
                .insert({
                    alias: row["ALIAS"],
                    songid: row["SONGID"]
                });
    }
    await trx.commit();
}

async function users() {
    const rows = await oldKnex("USER")
                        .select(
                            "PLAYERID",
                            "USERID",
                            "PASSWORD");

    const trx = await knex.transaction();
    for (const row of rows) {
        await trx("users")
                .insert({
                    playerid: row["PLAYERID"],
                    userid: row["USERID"],
                    password: row["PASSWORD"]
                });
    }
    await trx.commit();
}

async function songs() {
    const rows = await oldKnex("SONG")
                        .select(
                            "SONGID",
                            "SONGNAME",
                            "MASTERDIFFICULTY",
                            "EXPERTDIFFICULTY",
                            "ADVANCEDDIFFICULTY",
                            "BASICDIFFICULTY",
                            "NOTESCOUNT",
                            "SCOREVIDEOURL",
                            "SCOREIMAGEURL",
                            "GENREID");

    const trx = await knex.transaction();
    for (const row of rows) {
        await trx("songs")
                .insert([
                    {
                        songid: row["SONGID"],
                        songname: row["SONGNAME"],
                        difficulty: 0,
                        ratevalue: row["BASICDIFFICULTY"],
                        notes: 0,
                        scorevideourl: "",
                        scoreimageurl: "",
                        genreid: row["GENREID"]
                    }, {
                        songid: row["SONGID"],
                        songname: row["SONGNAME"],
                        difficulty: 1,
                        ratevalue: row["ADVANCEDDIFFICULTY"],
                        notes: 0,
                        scorevideourl: "",
                        scoreimageurl: "",
                        genreid: row["GENREID"]
                    }, {
                        songid: row["SONGID"],
                        songname: row["SONGNAME"],
                        difficulty: 2,
                        ratevalue: row["EXPERTDIFFICULTY"],
                        notes: 0,
                        scorevideourl: "",
                        scoreimageurl: "",
                        genreid: row["GENREID"]
                    }, {
                        songid: row["SONGID"],
                        songname: row["SONGNAME"],
                        difficulty: 3,
                        ratevalue: row["MASTERDIFFICULTY"],
                        notes: row["NOTESCOUNT"],
                        scorevideourl: row["SCOREVIDEO"],
                        scoreimageurl: row["SCOREIMAGE"],
                        genreid: row["GENREID"]
                    }]);
    }
    await trx.commit();
}

async function scores() {
    let i = 0;
    while (true) {
        const trx = await knex.transaction();
        const rows = await oldKnex("SCORE")
                            .select(
                                "PLAYERID",
                                "SONGID",
                                "BASICSCORE",
                                "BASICMARK",
                                "ADVANCEDSCORE",
                                "ADVANCEDMARK",
                                "EXPERTSCORE",
                                "EXPERTMARK",
                                "MASTERSCORE",
                                "MASTERMARK")
                            .limit(10000)
                            .offset(i * 10000);
        i++;
        console.log(i);
        if (rows.length === 0) {
            break;
        }
        for (const row of rows) {
            await trx("scores")
                    .insert([{
                        playerid: row["PLAYERID"],
                        songid: row["SONGID"],
                        difficulty: 0,
                        score: row["BASICSCORE"],
                        mark: row["BASICMARK"]
                    }, {
                        playerid: row["PLAYERID"],
                        songid: row["SONGID"],
                        difficulty: 1,
                        score: row["ADVANCEDSCORE"],
                        mark: row["ADVANCEDMARK"]
                    }, {
                        playerid: row["PLAYERID"],
                        songid: row["SONGID"],
                        difficulty: 2,
                        score: row["EXPERTSCORE"],
                        mark: row["EXPERTMARK"]
                    }, {
                        playerid: row["PLAYERID"],
                        songid: row["SONGID"],
                        difficulty: 3,
                        score: row["MASTERSCORE"],
                        mark: row["MASTERMARK"]
                    }]);
        }
        await trx.commit();
    }
}

async function ratelog() {
    const rows = await oldKnex("RATELOG")
                        .select(
                            "PLAYERID",
                            "RECORDDATE",
                            "CURRENTRATE",
                            "MAXRATE");

    const trx = await knex.transaction();
    for (const row of rows) {
        await trx("ratelog")
                .insert({
                    playerid: row["PLAYERID"],
                    recorddate: row["RECORDDATE"],
                    currentrate: row["CURRENTRATE"],
                    maxrate: row["MAXRATE"]
                });
    }
    await trx.commit();
}

async function groupmembers() {
    const rows = await oldKnex("RANKINGMEMBER")
                        .select(
                            "GROUPID",
                            "PLAYERID");

    const trx = await knex.transaction();
    for (const row of rows) {
        await trx("groupmembers")
                .insert({
                    groupid: row["GROUPID"],
                    playerid: row["PLAYERID"]
                });
    }
    await trx.commit();
}

async function worldsendsongs() {
    const worldsEndIcons = [
        "　", "招", "狂", "止", "改", "両", "嘘", "半", "時", "光",
        "割", "跳", "弾", "戻", "伸", "布", "敷", "翔", "謎", "？",
        "！", "避", "速", "歌", "没", "舞", "俺", "蔵", "覚"];

    const rows = await oldKnex("WESONG")
                        .select(
                            "WESONGID",
                            "SONGNAME",
                            "PARENTSONGID",
                            "ICON",
                            "DIFFICULTY",
                            "NOTESCOUNT");

    const trx = await knex.transaction();
    for (const row of rows) {
        await trx("worldsendsongs")
                .insert({
                    songid: row["WESONGID"],
                    songname: row["SONGNAME"] + `「${worldsEndIcons[row["ICON"]]}」`,
                    parentsongid: row["PARENTSONGID"],
                    difficulty: row["DIFFICULTY"],
                    notes: row["NOTES"],
                    scorevideourl: "",
                    scoreimageurl: ""
                });
    }
    await trx.commit();
}

async function worldsendscores() {
    let i = 0;
    while (true) {
        const rows = await oldKnex("WESCORE")
                            .select(
                                "PLAYERID",
                                "WESONGID",
                                "WESCORE",
                                "WEMARK")
                            .limit(10000)
                            .offset(i * 10000);
        i++;
        console.log(i);
        if (rows.length === 0) {
            break;
        }

        const trx = await knex.transaction();
        for (const row of rows) {
            await trx("worldsendscores")
                    .insert({
                        playerid: row["PLAYERID"],
                        songid: row["WESONGID"],
                        score: row["WESCORE"],
                        mark: row["WEMARK"]
                    });
        }
        await trx.commit();
    }
}

async function rivals() {
    const rows = await oldKnex("RIVAL")
                        .select(
                            "PLAYERID",
                            "RIVAL");

    const trx = await knex.transaction();
    for (const row of rows) {
        await trx("rivals")
                .insert({
                    playerid: row["PLAYERID"],
                    rival: row["RIVAL"]
                });
    }
    await trx.commit();
}

(async () => {
    try {
        console.log("プレイヤーデータ");
        await players();

        console.log("エイリアス");
        await aliases();

        console.log("ユーザー");
        await users();

        console.log("曲");
        await songs();

        console.log("スコア");
        await scores();

        console.log("レート履歴");
        await ratelog();

        console.log("グループメンバー");
        await groupmembers();

        console.log("World's End曲");
        await worldsendsongs();

        console.log("World's Endスコア");
        await worldsendscores();

        console.log("ライバル");
        await rivals();

        process.exit(0);
    } catch (err) {
        console.log(err);
        process.exit(-1);
    }
})();
