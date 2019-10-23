import * as Express from "express";
import register from "./register";
import signin from "./signin";
import verify from "./verify";

const router = Express.Router();

router.post("/register", register);
router.post("/signin", signin);
router.post("/verify", verify);

export default router;
