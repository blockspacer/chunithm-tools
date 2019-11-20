<template>
    <div v-if="ready">
        <div class="center item" v-if="signedin">
            <h2>Welcome!</h2>
            <p v-if="playerName.length > 0">{{playerName}}としてログイン中です。</p>
            <p v-else>プレイヤーデータが登録されていません。以下のブックマークレットを用いてプレイヤーデータを登録してください。</p>
            <p><a href="javascript:void(0)" @click="signout()">ログアウト</a></p>
        </div>
        <div class="home" v-else>
            <div class="float-left">
                <h2>CHUNITHM Toolsのスコアを分析</h2>
                <p>CHUNITHM ToolsはCHUNITHMのスコアを分析し、あなたの上達の手助けとなる情報を提供します。</p>
            </div>
            <div class="float-right item">
                <p class="input-name">ユーザーID</p>
                <p><input type="text" v-model="userid"></p>
                <p class="input-name">パスワード</p>
                <p><input type="password" v-model="password"></p>
                <p><input type="button" @click="signin()" value="ログイン"></p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from "vue"
    import request from "../lib/request";
    import {Player, validatePlayer} from "../../models/player";

    export default Vue.extend({
        data() {
            return {
                userid: "",
                password: "",
                playerName: "",
                signedin: false,
                ready: false
            }
        },
        methods: {
            getPlayer: async function() {
                const token = window.localStorage.getItem("token");
                this.playerName = "";
                const player: Player = await request("/api/players/get_player", {token});
                this.ready = true;
                if (!validatePlayer(player)) {
                    return;
                }
                this.playerName = player.playerName;
            },
            signin: async function() {
                const token = await request("/api/users/signin", {
                                        userId: this.userid,
                                        password: this.password
                                    });
                if (token === "") {
                    alert("サインインに失敗しました。");
                    return;
                }
                window.localStorage.setItem("token", token);
                this.signedin = true;
                this.getPlayer();
            },
            signout: function() {
                this.signedin = false;
                window.localStorage.setItem("token", "");
            }
        },
        mounted: async function() {
            const token = window.localStorage.getItem("token");
            if (token === null) {
                this.ready = true;
                return;
            }
            const verify = await request("/api/users/verify_token", {token});
            if (verify.status === "FAILED") {
                this.ready = true;
                return;
            }
            this.signedin = true;
            this.getPlayer();
        }
    });
</script>

<style scoped>
    .home {
        background-color: #222;
        color: #fff;
        position: relative;
        top: 0;
        left: 0;
        width: 100%;
        padding: 20px 0;
    }

    .float-left {
        position: relative;
        margin: 0 auto;
        width: 90%;
    }

    .float-right {
        position: relative;
        margin: 0 auto;
        width: 90%;
    }

    @media screen and (min-width: 768px) {
        .home {
            display: flex;
            align-items: center;
        }

        .float-left {
            margin: 0;
            position: relative;
            left: 10%;
            width: 35%;
        }

        .float-right {
            margin: 0;
            position: relative;
            left: 20%;
            width: 35%;
            padding: 10px;
            background-color: #fff;
            border-radius: 3px;
        }
    }
</style>
