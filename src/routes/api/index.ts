import * as Express from "express";
import players from "./players";
import {rateLimit} from "./rate_limit";
import rivals from "./rivals";
import scores from "./scores";
import shell from "./shell";
import songs from "./songs";
import users from "./users";

const router = Express.Router();

router.use(rateLimit);

router.use("/users", users);
router.use("/players", players);
router.use("/songs", songs);
router.use("/scores", scores);
router.use("/rivals", rivals);
router.post("/shell", shell);

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

export default router;
