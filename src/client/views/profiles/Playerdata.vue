<template>
    <div v-if="ready">
        <div class="item" v-if="playerExists">
            <h2>プレイヤーデータ</h2>
            <table>
                <tr>
                    <td>プレイヤー名</td><td>{{playerName}}</td>
                </tr>
                <tr>
                    <td>レート</td><td>{{currentRate}}/{{maxRate}}</td>
                </tr>
                <tr>
                    <td>称号</td><td>{{title}}</td>
                </tr>
                <tr>
                    <td>ベスト平均</td><td>{{bestAverage}}</td>
                </tr>
                <tr>
                    <td>リセント平均</td><td>{{recentAverage}}</td>
                </tr>
                <tr>
                    <td>到達可能レート</td><td>{{reachableRate}}</td>
                </tr>
            </table>
            <h2>ベスト枠</h2>
            <table>
                <tr>
                    <td>曲名</td>
                    <td>定数</td>
                    <td>スコア</td>
                    <td>レート</td>
                </tr>
                <tr v-for="score in best" :key="score.song.songId" :class="classes[score.song.difficulty]">
                    <td>{{score.song.songName}}</td>
                    <td>{{integerToRateValue(score.song.rateValue)}}</td>
                    <td>{{String(score.score)}}</td>
                    <td>{{integerToRate(score.rate)}}</td>
                </tr>
            </table>
            <h2>ベスト枠付近</h2>
            <table>
                <tr>
                    <td>曲名</td>
                    <td>定数</td>
                    <td>スコア</td>
                    <td>レート</td>
                </tr>
                <tr v-for="score in almostBest" :key="score.song.songId" :class="classes[score.song.difficulty]">
                    <td>{{score.song.songName}}</td>
                    <td>{{integerToRateValue(score.song.rateValue)}}</td>
                    <td>{{String(score.score)}}</td>
                    <td>{{integerToRate(score.rate)}}</td>
                </tr>
            </table>
        </div>
        <div class="item" v-else>
            <h2>プレイヤーデータ</h2>
            <p>プレイヤーデータが登録されていません。</p>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import request from "../../lib/request";
    import {Best} from "../../../models/best";
    import {Player, validatePlayer} from "../../../models/player";
    import {integerToRate, integerToRateValue} from '../../../helper/formatter';

    @Component
    export default class extends Vue {
        ready = false;
        playerExists = false;
        playerName = "";
        currentRate = "";
        maxRate = "";
        title = "";
        bestAverage = "";
        recentAverage = "";
        reachableRate = "";
        best: Best[] = [];
        almostBest: Best[] = [];
        readonly classes = ["basic", "advanced", "expert", "master"];

        integerToRate = integerToRate;
        integerToRateValue = integerToRateValue;

        async getPlayer() {
            const token = window.localStorage.getItem("token");
            const player: Player = await request("/api/players/get_player", {token});
            this.ready = true;
            if (!validatePlayer(player)) {
                return;
            }
            const best: Best[] = await request("/api/scores/best", {token, count: 50});
            this.best = best.slice(0, 30);
            this.almostBest = best.slice(30);
            const bestAverage = this.best.reduce((sum, song) => sum += song.rate, 0) / 30;

            this.playerExists = true;
            this.playerName = player.playerName;
            this.currentRate = integerToRate(player.currentRate);
            this.maxRate = integerToRate(player.maxRate);
            this.title = player.title;
            this.bestAverage = (bestAverage / 100).toFixed(4);
            this.recentAverage = (player.currentRate * 4 - bestAverage * 3).toFixed(4);
            this.reachableRate = integerToRate(Math.floor((bestAverage * 3 + this.best[0].rate) / 4));
        }

        async init() {
            const token = window.localStorage.getItem("token");
            if (token === null) {
                alert("サインインしてからご利用ください。");
                this.$router.push("/");
                return;
            }
            const verify = await request("/api/users/verify_token", {token});
            if (verify.status === "FAILED") {
                alert("サインインしてからご利用ください。");
                this.$router.push("/");
                return;
            }
            this.getPlayer();
        }

        constructor() {
            super();
            this.init();
        }
    }
</script>
