import {ControllerError} from "../exceptions";
import {bcrypt, compareBcrypt, sha256} from "../helper/hash";
import {encodeJWT} from "../helper/jwt";
import {knex} from "../knex_wrapper";

export async function create(userId: string, plainPassword: string, playerId: string) {
    const hashedPassword = await bcrypt(plainPassword);

    if (await exist(userId)) {
        throw new ControllerError("The user with the UserID is already exists");
    }

    await knex("users").insert({
        userid: userId,
        password: hashedPassword,
        playerid: playerId
    });
}

export async function exist(userId: string) {
    const count = await knex("users")
                        .count("userid as cnt")
                        .where("userid", userId);

    if (count.length === 0) {
        return false;
    }

    return count[0].cnt > 0;
}

export async function signIn(userId: string, plainPassword: string) {
    const oldHashedPassword = sha256(plainPassword);

    const rows = await knex("users")
                        .select("playerid", "password")
                        .where({
                            userid: userId
                        });

    if (rows.length === 0) {
        throw new ControllerError("Signing in failed");
    }

    if (
        rows[0].password !== oldHashedPassword
        && !await compareBcrypt(plainPassword, rows[0].password)
    ) {
        throw new ControllerError("Signing in failed");
    }

    return encodeJWT(rows[0].playerid);
}

export async function getPlayerId(userId: string) {
    const rows = await knex("users")
                        .select("playerid")
                        .where({
                            userid: userId
                        });

    if (rows.length === 0) {
        throw new ControllerError("Signing in failed");
    }

    return rows[0].playerid as string;
}
