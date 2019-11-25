import * as Express from "express";
import getScores from "./get_scores";
import setScores from "./set_scores";
import setSingleScore from "./set_single_score";

const router = Express.Router();

router.post("/get_scores", getScores);
router.post("/set_scores", setScores);
router.post("/set_single_score", setSingleScore);

export default router;
