<template>
    <div id="body">
        <div class="content">
            <div class="title">
                <h1>CHUNITHM Tools Loader</h1>
            </div>
            <div v-if="chunithmToolsToken">
                <p><input type="button" value="データを送信" @click="sendData()"></p>
                <p><input type="button" value="別のアカウントでログイン" @click="signout()"></p>
            </div>
            <div v-else>
                <p class="input-name">CHUNITHM ToolsユーザーID</p>
                <p><input type="text" v-model="userid"></p>
                <p class="input-name">パスワード</p>
                <p><input type="password" v-model="password"></p>
                <p><input type="button" value="サインイン" @click="signin()"></p>
                <p>LINE版をご利用の方へ: ユーザーIDとパスワードは「register ユーザー名, パスワード」というコマンドでご登録いただけます。</p>
            </div>
            <table>
                <tr v-for="message in messages" :key="message.time">
                    <td>[{{message.time}}]</td>
                    <td>
                        <a :href="message.link" v-if="message.link">{{message.text}}</a>
                        <span v-else>{{message.text}}</span>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import axios from "axios";
    import {HistoryList} from "../models/history_list";
    import {difficultyNameToInteger} from "../helper/formatter";
    import {Player} from "../models/player";
    import {ScoreList} from "../models/score_list";
    import {WorldsEndScoreList} from "../models/worldsendscore_list";

    @Component
    export default class extends Vue {
        messages: {text: string, time: string, link?: string}[] = [];
        userid = "";
        password = "";

        private chunithmNetToken: string;
        private chunithmToolsToken: string;

        async sendData() {
            try {
                await this.sendPlayerData();
                await this.sendHistory();
                await this.sendScores();
                await this.sendWorldsEndScores();
                this.log(
                    "データの送信に成功しました。更新差分はこちらからご確認頂けます。",
                    `https://chunithmtools.net/#/difference?token=${this.chunithmToolsToken}`);
            } catch (err) {
                this.log("データの送信に失敗しました。");
                throw err;
            }
        }

        async signin() {
            const token = await this.request("https://chunithmtools.net/api/users/signin", {
                                        userId: this.userid,
                                        password: this.password
                                    }) || null;
            if (token === null) {
                this.log("サインインに失敗しました。");
                return;
            }
            window.localStorage.setItem("token", token);
            this.chunithmToolsToken = token;
            this.log("サインインに成功しました。");
        }

        async signout() {
            window.localStorage.setItem("token", "");
            this.chunithmToolsToken = "";
            this.log("サインアウトしました。");
        }

        private async sendPlayerData() {
            this.log("プレイヤーデータの取得を開始");
            const player: Player = {
                playerName: "",
                currentRate: 0,
                maxRate: 0,
                title: "",
                emblemTop: 0,
                emblemBase: 0
            };

            const html = await this.request("https://chunithm-net.com/mobile/home/playerData/");
            const parsed = this.parseHTML(html);
            const frame = parsed.getElementsByClassName("frame01_inside w450")[0];

            if (frame == null) {
                throw Error("プレイヤーデータを取得中にエラーが発生しました。");
            }

            const rates = (frame.getElementsByClassName("player_rating")[0] as HTMLElement).innerText;
            const emblemBase = frame.getElementsByClassName("block_classemblem_base");
            const emblemTop = frame.getElementsByClassName("block_classemblem_emblem");

            player.playerName = (frame.getElementsByClassName("ml_10")[0] as HTMLElement).innerText;
            player.currentRate = Number((rates.match(/: (\d*)\.(\d*)/) || [0, 0, 0]).slice(1,3).join(""));
            player.maxRate = Number((rates.match(/: (\d*)\.(\d*)/) || [0, 0, 0]).slice(1,3).join(""));
            player.title = (frame.getElementsByClassName("player_honor_text")[0] as HTMLElement).innerText;

            if (emblemBase.length > 0) {
                const matches = emblemBase[0].innerHTML.match(/_(\d\d)/);
                if (matches) {
                    player.emblemBase = parseInt(matches[1]);
                }
            }

            if (emblemTop.length > 0) {
                const matches = emblemTop[0].innerHTML.match(/_(\d\d)/);
                if (matches) {
                    player.emblemTop = parseInt(matches[1]);
                }
            }

            await this.request("https://chunithmtools.net/api/players/set_player", {
                                    token: this.chunithmToolsToken,
                                    player: player
                                });
        }

        private async sendHistory() {
            this.log("スコア履歴の取得を開始");
            const history: HistoryList = [];

            const html = await this.request("https://chunithm-net.com/mobile/record/playlog");
            const parsed = this.parseHTML(html);
            const songs = Array.from(parsed.getElementsByClassName("frame02 w400"));
            for (const song of songs) {
                const songName = (song.getElementsByClassName("play_musicdata_title")[0] as HTMLElement).innerText;
                const scoreElement = (song.getElementsByClassName("play_musicdata_score_text")[0] as HTMLElement).innerText;
                const score = parseInt((scoreElement.match(/：([0-9,]*)/) || ["", "0"])[1].split(',').join('').trim());
                const difficultyName = (song.innerHTML.match(/https:\/\/chunithm-net.com\/mobile\/images\/icon_text_([^.]*)\.png"/) || ["", "master"])[1];
                const time = (song.getElementsByClassName("play_datalist_date")[0] as HTMLElement).innerText.split('/').join('-').trim();
                history.push({
                    songName: songName,
                    score: score,
                    difficulty: difficultyNameToInteger(difficultyName),
                    time: time,
                });
            }

            await this.request("https://chunithmtools.net/api/scores/set_history", {
                                    token: this.chunithmToolsToken,
                                    history: history
                                });
        }

        private async sendScores() {
            const difficultyNames = ["Basic", "Advanced", "Expert", "Master"];
            const scores: ScoreList = {};

            for (const index of [0, 1, 2, 3]) {
                const difficulty = difficultyNames[index];
                const html = await this.request(
                                            `https://chunithm-net.com/mobile/record/musicGenre/send${difficulty}`,
                                            {token: this.chunithmNetToken, genre: 99},
                                            true);
                const parsed = this.parseHTML(html);
                const songs = Array.from(parsed.getElementsByClassName("musiclist_box"));

                this.log(`スコアの取得を開始: ${difficulty}`);

                for (const song of songs) {
                    const scoreElement = song.getElementsByClassName("text_b")[0] as HTMLElement;
                    const idElement = song.innerHTML.match(/name="idx" value="(\d+)+"/);
                    if (!idElement) {
                        continue;
                    }

                    const id = parseInt(idElement[1]);

                    if (scoreElement) {
                        const score = parseInt((scoreElement.textContent || "0").split(',').join('').trim());
                        const images = Array.from(song.getElementsByTagName("img"));
                        let mark = 0;

                        for (const image of images) {
                            const src = image.getAttribute("src") || "";
                            if (src.indexOf("icon_fullcombo") !== -1) {
                                mark = 1;
                            }
                            if (src.indexOf("icon_alljustice") !== -1) {
                                mark = 2;
                            }
                            if (src.indexOf("icon_fullchain") !== -1) {
                                mark += 3;
                            }
                        }

                        if (!(id in scores)) {
                            scores[id] = [[0, 0], [0, 0], [0, 0], [0, 0]];
                        }
                        scores[id][index] = [score, mark];
                    } else {
                        if (!(id in scores)) {
                            scores[id] = [[0, 0], [0, 0], [0, 0], [0, 0]];
                        }
                        scores[id][index] = [0, 0];
                    }
                }
            }

            await this.request("https://chunithmtools.net/api/scores/set_scores", {
                                    token: this.chunithmToolsToken,
                                    scores: scores
                                });
        }

        private async sendWorldsEndScores() {
            const scores: WorldsEndScoreList = {};

            const html = await this.request("https://chunithm-net.com/mobile/worldsEnd/worldsEndList/");
            const parsed = this.parseHTML(html);
            const songs = Array.from(parsed.getElementsByTagName("form"));

            this.log("スコアの取得を開始: World's End");

            for (const song of songs) {
                const scoreElement = song.getElementsByClassName("text_b")[0] as HTMLElement;
                const idElement = song.innerHTML.match(/name="idx" value="(\d+)+"/);
                if (!idElement) {
                    continue;
                }

                const id = parseInt(idElement[1]);

                if (scoreElement) {
                    const score = parseInt((scoreElement.textContent || "0").split(',').join('').trim());
                    const images = Array.from(song.getElementsByTagName("img"));
                    let mark = 0;

                    for (const image of images) {
                        const src = image.getAttribute("src") || "";
                        if (src.indexOf("icon_fullcombo") !== -1) {
                            mark = 1;
                        }
                        if (src.indexOf("icon_alljustice") !== -1) {
                            mark = 2;
                        }
                        if (src.indexOf("icon_fullchain") !== -1) {
                            mark += 3;
                        }
                    }

                    if (!(id in scores)) {
                        scores[id] = [0, 0];
                    }
                    scores[id] = [score, mark];
                } else {
                    if (!(id in scores)) {
                        scores[id] = [0, 0];
                    }
                    scores[id] = [0, 0];
                }
            }

            await this.request("https://chunithmtools.net/api/scores/worldsend/set_scores", {
                                    token: this.chunithmToolsToken,
                                    scores: scores
                                });
        }

        private log(message: string, link?: string) {
            function format(num: number, digit: number) {
                return ("0".repeat(digit) + String(num)).slice(-digit);
            }
            const date = new Date();
            const hours = format(date.getHours(), 2);
            const minutes = format(date.getMinutes(), 2);
            const seconds = format(date.getSeconds(), 2);
            const milliseconds = format(date.getMilliseconds(), 3);
            this.messages.push({
                text: message,
                time: `${hours}:${minutes}:${seconds}.${milliseconds}`,
                link: link
            });
        }

        private parseHTML(html: string) {
            try {
                const parser = new DOMParser();
                return parser.parseFromString(html, "text/html");
            } catch (err) {
                this.log("不明なエラーが発生しました。");
                throw err;
            }
        }

        private async request(url: string, data?: any, urlEncoded: boolean = false) {
            try {
                const options = {
                    validateStatus: () => true
                };

                const request = urlEncoded
                                ? Object.keys(data)
                                        .reduce<URLSearchParams>((acc, key) => {
                                                                    acc.append(key, data[key]);
                                                                    return acc;
                                                                }, new URLSearchParams())
                                : data;

                const response = data
                                 ? (await axios.post(url, request, options))
                                 : (await axios.get(url, options));

                if (response.status >= 300) {
                    this.log(`${url}を取得中にエラーが発生しました: ${response.status}`);
                    throw new Error("HTTP Error");
                }

                try {
                    return JSON.parse(response.data);
                } catch {
                    return response.data;
                }
            } catch (err) {
                if (err.message !== "HTTP Error") {
                    this.log("不明なエラーが発生しました。");
                }
                throw err;
            }
        }

        private async init() {
            this.chunithmNetToken = document.getElementsByName("token")[0].getAttribute("value") || "";
            const token = window.localStorage.getItem("token");
            if (token === null) {
                return;
            }
            const verify = await this.request("https://chunithmtools.net/api/users/verify_token", {token});
            if (verify.status === "FAILED") {
                return;
            }
            this.chunithmToolsToken = token;
        }

        mounted() {
            this.init();
        }
    }
</script>

<style scoped>
    #body {
        background-color: rgba(255, 255, 255, 0.8);
        font-family: sans-serif;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 100000;
        overflow-y: scroll;
    }

    .content {
        position: relative;
        width: 100%;
        max-width: 768px;
        margin: 0 auto;
    }

    .title {
        color: #FFF;
        background-color: #000;
        width: 90%;
        margin: 0 auto;
        text-align: center;
    }

    .input-name {
        font-size: 80%;
        opacity: 0.8;
    }

    h1 {
        font-size: 200%;
        line-height: 150%;
    }

    table {
        text-align: left;
    }

    input[type="text"], input[type="password"] {
        border: 0;
        border-bottom: 2px solid #000;
        background-color: #fff;
        padding: 5px;
        font-size: 100%;
        -webkit-border-radius: 0;
        -webkit-appearance: none;
        -webkit-tap-highlight-color: rgba(0,0,0,0);
        color: #000;
        width: 95%;
    }

    input[type="submit"], input[type="button"] {
        border-radius: 3px;
        background-color: #0bf;
        color: #fff;
        font-weight: bold;
        -webkit-box-sizing: content-box;
        -webkit-appearance: button;
        appearance: button;
        border: none;
        box-sizing: border-box;
        cursor: pointer;
        width: calc(100% - 10px);
        padding: 10px 0;
        margin: 5px;
    }
</style>
