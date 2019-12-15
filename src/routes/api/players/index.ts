import * as Express from "express";
import getPlayer from "./get_player";
import ratelog from "./ratelog";
import setPlayer from "./set_player";

const router = Express.Router();

router.post("/get_player", getPlayer);
router.post("/set_player", setPlayer);
router.post("/ratelog", ratelog);

export default router;
