<template>
    <div>
        <div id="header">
            <img class="menuicon" src="/menu.png" @click="menu = !menu">
            <router-link to="/">
                <img class="icon" src="/chunithmtools2.png">
            </router-link>
        </div>
        <div id="main"><router-view></router-view></div>
        <div id="menu" @click="menu = !menu" :class="{visible: menu}">
            <h2>機能一覧</h2>
            <ul>
                <li><router-link to="/border">ボーダー算出</router-link></li>
                <li><router-link to="/random">ランダム選曲</router-link></li>
                <li><router-link to="/difficulty">適正難易度</router-link></li>
                <li><router-link to="/calcscore">スコア計算</router-link></li>
                <li><router-link to="/shell">シェル</router-link></li>
                <li><router-link to="/statistics">統計</router-link></li>
            </ul>
            <p><b>ログイン必須</b></p>
            <ul>
                <li><router-link to="/playerdata">プレイヤーデータ</router-link></li>
                <li><router-link to="/scorelist">スコア一覧</router-link></li>
                <li><router-link to="/scorehistory">スコア履歴</router-link></li>
                <li><router-link to="/recommend">リコメンド</router-link></li>
                <li><router-link to="/registerscore">スコア登録</router-link></li>
                <li><router-link to="/difference">更新差分</router-link></li>
                <li><router-link to="/rival">ライバル</router-link></li>
                <li><router-link to="/worldsendscorelist">WORLD'S ENDスコア一覧</router-link></li>
                <li><router-link to="/worldsendregisterscore">WORLD'S ENDスコア登録</router-link></li>
                <li><router-link to="/overpower">オーバーパワー</router-link></li>
                <li><router-link to="/settings">設定</router-link></li>
            </ul>
            <h2>その他機能</h2>
            <ul>
                <li><a href="javascript:void(0)" @click="toCanvas()">現在の画面を画像に変換/Twitterに投稿</a></li>
            </ul>
        </div>
        <div class="image" v-if="dialog">
            <div v-if="displayName">
                <h2>Twitterへ投稿</h2>
                <p>Twitterユーザー名: {{displayName}}</p>
                <p class="input-name">テキスト</p>
                <input type="text" v-model="twitterText">
                <input type="button" value="投稿" @click="post()">
            </div>
            <div v-else>
                <p>Twitter投稿機能は<router-link to="/settings">Twitter連携</router-link>してからご利用ください。</p>
            </div>
            <input type="button" value="閉じる" @click="dialog = false">
            <img :src="canvasURL">
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import * as html2canvas from "html2canvas";
    import request from "./lib/request";

    @Component
    export default class extends Vue {
        menu = false;
        dialog = false;
        twitterText = "";
        displayName = "";

        private canvasURL: string | null = null;

        async post() {
            const token = window.localStorage.getItem("token");

            await request("/api/twitter/post_image", {
                                token: token,
                                image: this.canvasURL,
                                text: this.twitterText
                            });

            alert("投稿に成功しました。");
        }

        async toCanvas() {
            const token = window.localStorage.getItem("token");
            if (token === null) {
                alert("ログインしてからご利用ください。");
                return;
            }
            const verify = await request("/api/users/verify_token", {token});
            if (verify.status === "FAILED") {
                alert("ログインしてからご利用ください。");
                return;
            }
            this.displayName = await request("/api/twitter/display_name", {token});

            window.scrollTo(0, 0);
            const element = document.getElementById("main");
            if (!element) {
                return;
            }
            const canvas = await html2canvas(element, {});
            this.canvasURL = canvas.toDataURL("image/png");

            this.dialog = true;
            this.twitterText = "#CHUNITHM_Tools";
        }
    };
</script>

<style scoped>
    #menu {
        position: fixed;
        width: 280px;
        height: calc(100% - 70px);
        top: 0;
        right: 100%;
        padding: 70px 20px 0;
        transition-duration: 0.5s;
        background-color: #fff;
        border-right: 1px solid #888;
        overflow-y: scroll;
    }

    #menu.visible {
        right: calc(100% - 320px);
    }

    #main {
        position: absolute;
        width: 100%;
        top: 70px;
        left: 0;
    }

    #header {
        padding: 0;
        width: 100%;
        height: 70px;
        position: fixed !important;
        position: absolute;
        top: 0;
        left: 0;
        background-color: #000;
        color: #fff;
        font-size: 45px;
        z-index: 999;
    }

    .icon {
        position: absolute;
        margin: 0;
        left: calc(50% - 25px);
        top: 10px;
        width: 50px;
        height: 50px;
    }

    .menuicon {
        position: absolute;
        margin: 0;
        left: 0;
        top: 10px;
        width: 50px;
        height: 50px;
    }

    .image {
        background-color: #FFF;
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 1234;
        overflow-y: scroll;
    }
</style>
