import * as Express from "express";
import * as Passport from "passport";
import * as Twitter from "passport-twitter";
import {getConfig} from "../config";
import {register, signInByTwitterToken} from "../controllers/twitter";
import {signInByPlayerId} from "../controllers/users";
import {sha256} from "../helper/hash";

export default function() {
    const config = getConfig();

    Passport.serializeUser((user, callback) => callback(null, user));
    Passport.deserializeUser((obj, callback) => callback(null, obj));
    Passport.use("link", new Twitter.Strategy({
        consumerKey: config.twitter.consumerKey,
        consumerSecret: config.twitter.consumerSecret,
        callbackURL: "https://ctdev.raclett3.com/auth/callback/link"
    }, (token, secret, profile, callback) => {
        process.nextTick(() => {
            return callback(null, {
                accessToken: token,
                secret,
                profile
            });
        });
    }));

    Passport.use("signin", new Twitter.Strategy({
        consumerKey: config.twitter.consumerKey,
        consumerSecret: config.twitter.consumerSecret,
        callbackURL: "https://ctdev.raclett3.com/auth/callback/signin"
    }, (token, secret, profile, callback) => {
        process.nextTick(() => {
            return callback(null, {
                accessToken: token,
                secret,
                profile
            });
        });
    }));

    const app = Express.Router();
    app.get("/link", Passport.authenticate("link"));
    app.get("/signin", Passport.authenticate("signin"));

    app.get("/callback/link", (req, res, next) => {
        Passport.authenticate("link", async (err: any, user: any) => {
            if (err) {
                next(err);
            }
            if (user === false) {
                res.redirect(302, "https://ctdev.raclett3.com/#/settings");
                return;
            }
            const token = sha256(user.profile.id + config.twitter.consumerKey);
            await register(token, user.accessToken, user.secret, user.profile.id, "");
            res.redirect(302, "https://ctdev.raclett3.com/#/settings?twitter=" + token);
        })(req, res, next);
    });

    app.get("/callback/signin", (req, res, next) => {
        Passport.authenticate("signin", async (err: any, user: any) => {
            if (err) {
                next(err);
            }
            if (!user) {
                res.redirect(302, "https://ctdev.raclett3.com/");
                return;
            }
            const token = sha256(user.profile.id + config.twitter.consumerKey);
            const playerId = await signInByTwitterToken(token);
            if (playerId) {
                const token = await signInByPlayerId(playerId);
                res.redirect(302, "https://ctdev.raclett3.com/#/?token=" + token);
                return;
            }
            res.redirect(302, "https://ctdev.raclett3.com/");
        })(req, res, next);
    });

    return app;
}
