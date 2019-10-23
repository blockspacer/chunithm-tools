import * as Express from "express";
import random from "./random";
import search from "./search";

const router = Express.Router();

router.post("/random", random);
router.post("/search", search);

export default router;
