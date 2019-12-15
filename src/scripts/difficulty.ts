import {cacheDifficulty} from "../controllers/difficulty";

(async () => {
    console.log("Difficultyのキャッシュを開始");
    await cacheDifficulty();
    console.log("完了しました。");
    process.exit(0);
})();
