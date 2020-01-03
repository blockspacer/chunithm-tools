import {loadConfig} from "./config";
import {listen} from "./routes";

(async () => {
    console.log("CHUNITHM Tools 4.0.2");

    if (process.env.HOST) {
        process.env.HOST = process.env.NODE_ENV === "production"
                                        ? "chunithmtools.net"
                                        : "ctenv.raclett3.com";
    }

    console.log("設定を読み込んでいます…");
    if (!loadConfig(process.cwd() + "/config/config.json")) {
        console.log("失敗しました。");
        process.exit(-1);
    }
    console.log("完了しました。");

    console.log("HTTPサーバーを起動しています。");
    if (!await listen()) {
        console.log("失敗しました。");
        process.exit(-1);
    }
    console.log("完了しました。");
})();
