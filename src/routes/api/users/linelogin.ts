import * as Express from "express";
import {getConfig} from "../../../config";

export default async function(_: Express.Request, res: Express.Response): Promise<void> {
    const config = getConfig();
    res.redirect(302,
        "https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=" + config.lineLogin.clientId + "&redirect_uri=https%3A%2F%2Fctdev.raclett3.com%2Flinelogin&state=chunithmtools&scope=openid");
}
