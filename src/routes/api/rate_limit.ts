import * as Express from "express";

const timestamps: {[key: string]: number[]} = {};

export function rateLimit(req: Express.Request, res: Express.Response, next: Express.NextFunction) {
    const ip = req.ip;
    const now = Math.floor(Date.now() / 1000);
    if (!(ip in timestamps)) {
        timestamps[ip] = [];
    }

    timestamps[ip].push(now);
    timestamps[ip] = timestamps[ip].filter((time) => now - time < 5);
    if (timestamps[ip].length > 10) {
        res.status(429);
        res.json({});
        return;
    }

    next();
}
