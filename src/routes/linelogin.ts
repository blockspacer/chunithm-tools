import {createHmac} from "crypto";
import * as Express from "express";
import * as JWT from "jsonwebtoken";
import * as request from "request";
import {getConfig} from "../config";
import {signInByPlayerId} from "../controllers/users";

function hexHmac(content: string) {
    const config = getConfig();
    return createHmac("sha256", String(config.line.secret)).update(String(content)).digest("hex");
}

export default async function(req: Express.Request, res: Express.Response): Promise<void> {
    const state: string = req.query.state;
    const code: string = req.query.code;
    if (typeof state !== "string" || typeof code !== "string") {
        res.status(400).send("");
        return;
    }

    const config = getConfig();

    request.post("https://api.line.me/oauth2/v2.1/token", {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        form: {
            grant_type: "authorization_code",
            code,
            redirect_uri: `https://${process.env.HOST}/linelogin`,
            client_id: config.lineLogin.clientId,
            client_secret: config.lineLogin.clientSecret
        }
    }, async (_1: any, _2: any, body: string) => {
        const response: any = JSON.parse(body);
        try {
            const decoded: {[key: string]: string} = JWT.verify(response.id_token, config.lineLogin.clientSecret, {
                issuer: "https://access.line.me",
                audience: config.lineLogin.clientId,
                algorithms: ["HS256"]
            }) as {[key: string]: string};
            const token = await signInByPlayerId(hexHmac(decoded.sub));
            res.redirect(302, `https://${process.env.HOST}/#/?token=${token}`);
        } catch (err) {
            res.status(200).send("");
        }
    });
}
