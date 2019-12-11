<template>
    <div v-if="ready" class="item">
        <h2>スコア履歴</h2>
        <table>
            <tr>
                <td>日時</td>
                <td>曲名</td>
                <td>譜面定数</td>
                <td>スコア</td>
            </tr>
            <tr v-for="score in scores" :key="`${score.song.songId}-${score.song.difficulty}`" :class="classes[score.song.difficulty]">
                <td>{{score.time}}</td>
                <td>{{score.song.songName}}</td>
                <td>{{integerToRateValue(score.song.rateValue)}}</td>
                <td>{{score.score}}</td>
            </tr>
        </table>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import request from "../../lib/request";
    import {History} from "../../../models/history";
    import {integerToRateValue} from '../../../helper/formatter';

    @Component
    export default class extends Vue {
        ready = false;
        scores: History[] = [];
        readonly classes = ["basic", "advanced", "expert", "master"];

        integerToRateValue = integerToRateValue;

        async getScore() {
            const token = window.localStorage.getItem("token");
            this.scores = await request("/api/scores/get_history", {token});
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
            await this.getScore();
        }

        mounted() {
            this.init();
        }
    }
</script>
