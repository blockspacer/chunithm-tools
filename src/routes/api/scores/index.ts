import * as Express from "express";
import best from "./best";
import difference from "./difference";
import getHistory from "./get_history";
import getScores from "./get_scores";
import setHistory from "./set_history";
import setScores from "./set_scores";

const router = Express.Router();

router.post("/best", best);
router.post("/difference", difference);
router.post("/get_history", getHistory);
router.post("/get_scores", getScores);
router.post("/set_history", setHistory);
router.post("/set_scores", setScores);

export default router;
