import * as Express from "express";
import search from "./search";

const router = Express.Router();

router.post("/search", search);

export default router;
