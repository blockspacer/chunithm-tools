<template>
    <div v-if="ready" class="item">
        <h2>リコメンド</h2>
        <p>他のプレイヤーに比べスコアの低い曲を表示します。</p>
        <details>
            <summary>リコメンドレート</summary>
            <p>リコメンドレート: {{integerToRate(recommendRate)}}</p>
            <p>リコメンドレートはリコメンド情報から求められた統計的なレートです。スコアの更新が無くても変動することがありますのでご注意ください。</p>
        </details>
        <table>
            <tr>
                <td>曲名</td>
                <td>譜面定数</td>
                <td>リコメンド値</td>
            </tr>
            <tr v-for="score in recommend" :key="score.song.songId" class="master">
                <td>{{score.song.songName}}</td>
                <td>{{integerToRateValue(score.song.rateValue)}}</td>
                <td>{{integerToRate(score.rate)}}</td>
            </tr>
        </table>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import request from "../../lib/request";
    import {Recommend} from "../../../models/recommend";
    import {integerToRate, integerToRateValue} from '../../../helper/formatter';

    @Component
    export default class extends Vue {
        ready = false;
        recommend: Recommend[] = [];
        recommendRate: number = 1298;

        integerToRateValue = integerToRateValue;
        integerToRate = integerToRate;

        async getRecommend() {
            const token = window.localStorage.getItem("token");
            this.recommend = await request("/api/scores/recommend", {token});
            this.recommend.sort((a, b) => a.rate - b.rate);
            const recommendRateTarget = this.recommend.filter((score) => score.song.rateValue >= 130);
            if (recommendRateTarget.length > 0) {
                this.recommendRate = recommendRateTarget[Math.floor(recommendRateTarget.length / 2)].rate;
            }

            this.ready = true;
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
            await this.getRecommend();
        }

        constructor() {
            super();
            this.init();
        }
    }
</script>
