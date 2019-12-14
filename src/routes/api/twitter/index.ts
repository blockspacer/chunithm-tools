import * as Express from "express";
import diaplayName from "./display_name";
import enableToken from "./enable_token";
import postImage from "./post_image";

const router = Express.Router();

router.post("/post_image", postImage);
router.post("/display_name", diaplayName);
router.post("/enable_token", enableToken);

export default router;
