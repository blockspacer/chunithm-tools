import * as Express from "express";
import register from "./register";
import signin from "./signin";
import verifyToken from "./verify_token";

const router = Express.Router();

router.post("/register", register);
router.post("/signin", signin);
router.post("/verify_token", verifyToken);

export default router;
