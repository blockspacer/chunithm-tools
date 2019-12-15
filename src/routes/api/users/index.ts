import * as Express from "express";
import linelogin from "./linelogin";
import register from "./register";
import signin from "./signin";
import verifyToken from "./verify_token";

const router = Express.Router();

router.use("/linelogin", linelogin);
router.post("/register", register);
router.post("/signin", signin);
router.post("/verify_token", verifyToken);

export default router;
