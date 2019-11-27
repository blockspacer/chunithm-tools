import * as Express from "express";
import add from "./add";
import compare from "./compare";
import getCode from "./get_code";
import issueCode from "./issue_code";
import ranking from "./ranking";
import remove from "./remove";
import rivals from "./rivals";

const router = Express.Router();

router.post("/", rivals);
router.post("/add", add);
router.post("/remove", remove);
router.post("/get_code", getCode);
router.post("/issue_code", issueCode);
router.post("/compare", compare);
router.post("/ranking", ranking);

export default router;
