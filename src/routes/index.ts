import * as BodyParser from "body-parser";
import * as Express from "express";
import {getConfig} from "../config";
import api from "./api";
import line from "./line";

export const app = Express();

app.use(BodyParser.urlencoded({parameterLimit: 10485760, limit: 10485760, extended: true}));
app.use(BodyParser.json({limit: 10485760}));

app.options("*", (_, res) => {
    res.setHeader("Access-Control-Allow-Origin", "https://chunithm-net.com");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.sendStatus(200);
});

app.use((_, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "https://chunithm-net.com");
    res.setHeader("Cache-Control", "no-cache");
    next();
});

app.use("/api", api);
app.use("/line", line);
app.use("/", Express.static(process.cwd() + "/build/client"));

app.use((_, res, next) => {
    res.setHeader("Content-type", "text/javascript");
    next();
});
app.use("/b.js", Express.static(process.cwd() + "/build/bookmarklet/index.js"));

app.use((_, res) => {
    res.status(404);
    res.send("404 Error");
});

app.use((err: Express.ErrorRequestHandler,
         _1: Express.Request,
         res: Express.Response,
         _2: Express.NextFunction) => {
            res.status(500);
            console.log(err);
            res.send("500 Error");
         });

export async function listen() {
    return await new Promise<boolean> (async (resolve) => {
        const config = getConfig();

        try {
            app.listen(config.port, () => {
                resolve(true);
            });
        } catch (err) {
            console.log(err);
            resolve(false);
        }
    });
}
