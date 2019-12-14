import dataUriToBuffer = require("data-uri-to-buffer");
import * as Twitter from "twitter";
import {getConfig} from "../config";
import {knex, onDuplicateKey} from "../knex_wrapper";

export async function register(token: string, accessToken: string, secret: string, userId: string, playerId: string) {
    await onDuplicateKey("twitter", {
        token
    }, {
        accessToken,
        secret,
        userid: userId,
        playerid: playerId
    });
}

export async function setPlayerId(token: string, playerId: string): Promise<boolean> {
    const rows = await knex("twitter")
                        .select("playerid")
                        .where({token});

    if (rows.length === 0) {
        return false;
    }

    await knex("twitter")
            .update({
                playerid: playerId
            })
            .where({token});

    return true;
}

export async function signInByTwitterToken(token: string): Promise<string | null> {
    const rows = await knex("twitter")
                        .select("playerid")
                        .where({token});
    return rows.length > 0
            ? rows[0].playerid
            : null;
}

export function twitter(accessToken: string, secret: string) {
    const config = getConfig();
    const client = new Twitter({
        consumer_key: config.twitter.consumerKey,
        consumer_secret: config.twitter.consumerSecret,
        access_token_key: accessToken,
        access_token_secret: secret
    });
    return client;
}

export async function getDisplayName(playerId: string): Promise<string> {
    const rows = await knex("twitter")
                        .select("userid")
                        .where({playerid: playerId});

    if (rows.length === 0) {
        return "";
    }

    const client = twitter(rows[0].accesstoken, rows[0].secret);
    const result = await client.get("users/show", {
        user_id: rows[0].userid
    });

    if ("screen_name" in result) {
        return result.screen_name;
    }

    return "";
}

export async function postToTwitter(playerId: string, text: string, mediaURI: string): Promise<boolean> {
    const rows = await knex("twitter")
                        .select("accesstoken", "secret")
                        .where({playerid: playerId});

    if (rows.length === 0) {
        return false;
    }

    const client = twitter(rows[0].accesstoken, rows[0].secret);
    const decodedData = dataUriToBuffer(mediaURI);
    const media = await client.post("media/upload", {
        command: "INIT",
        total_bytes: decodedData.length,
        media_type: "image/png"
    });
    if (!("media_id_string" in media)) {
        return false;
    }
    const mediaId: string = media.media_id_string;
    const length = Math.ceil(decodedData.length / 1000000);
    for (let i = 0; i < length; i++) {
        await client.post("media/upload", {
            command: "APPEND",
            media_id: mediaId,
            media: decodedData.slice(i * 1000000, (i + 1) * 1000000),
            segment_index: i
        });
    }

    const final = await client.post("media/upload", {
        command: "FINALIZE",
        media_id: mediaId
    });

    if (!("media_id_string" in final)) {
        return false;
    }

    await client.post("statuses/update", {
        status: text,
        media_ids: mediaId
    });

    return true;
}
