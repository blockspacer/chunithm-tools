import * as Express from "express";
import difficulty from "./difficulty";
import random from "./random";
import search from "./search";
import worldsend from "./worldsend";

const router = Express.Router();

router.post("/difficulty", difficulty);
router.post("/random", random);
router.post("/search", search);
router.use("/worldsend", worldsend);

export default router;
