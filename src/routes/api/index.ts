import * as Express from "express";
import {rateLimit} from "./rate_limit";

const router = Express.Router();

router.use(rateLimit);

router.use((_, res) => {
    res.status(404);
    res.json({});
});

router.use((err: Express.ErrorRequestHandler,
            _1: Express.Request,
            res: Express.Response,
            _2: Express.NextFunction) => {
            res.status(500);
            console.log(err);
            res.json({});
         });
