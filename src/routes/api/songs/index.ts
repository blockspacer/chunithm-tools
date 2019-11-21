import * as Express from "express";
import difficulty from "./difficulty";
import random from "./random";
import search from "./search";

const router = Express.Router();

router.post("/difficulty", difficulty);
router.post("/random", random);
router.post("/search", search);

export default router;
