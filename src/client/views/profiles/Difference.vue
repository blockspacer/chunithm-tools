<template>
    <div v-if="ready" class="item">
        <h2>スコア履歴</h2>
        <table>
            <tr v-for="(score, key) in total" :key="key" :class="classes[key]">
                <td class="right">{{score.oldScore}}</td>
                <td class="center small">+{{score.newScore - score.oldScore}}</td>
                <td>{{score.newScore}}</td>
            </tr>
        </table>
        <table>
            <template v-for="score in scores">
                <tr :key="`${score.song.songId}-${score.song.difficulty}1`" :class="classes[score.song.difficulty]" colspan="3">
                    <td>{{score.song.songName}}</td>
                </tr>
                <tr :key="`${score.song.songId}-${score.song.difficulty}2`">
                    <td class="right">{{score.oldScore}}</td>
                    <td class="center small">+{{score.newScore - score.oldScore}}</td>
                    <td>{{score.newScore}}</td>
                </tr>
            </template>
        </table>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import request from "../../lib/request";
    import {Difference} from "../../../models/difference";
    import {Score} from "../../../models/score";
    import {integerToRateValue} from '../../../helper/formatter';

    type TotalDifference = {oldScore: number, newScore: number};

    @Component
    export default class extends Vue {
        ready = false;
        scores: Difference[] = [];
        total: TotalDifference[] = [];
        readonly classes = ["basic", "advanced", "expert", "master"];

        integerToRateValue = integerToRateValue;

        async getTotalDifference() {
            const token = window.localStorage.getItem("token");
            const scores: Score[] = await request("/api/scores/get_scores", {token});
            this.total = this.scores.reduce<TotalDifference[]>((acc, x) => {
                    acc[x.song.difficulty].oldScore -= x.newScore - x.oldScore;
                    return acc;
                },
                scores.reduce<number[]>((acc, x) => {
                    acc[x.song.difficulty] += x.score;
                    return acc;
                }, [0, 0, 0, 0])
                    .map<TotalDifference>((x) =>  ({oldScore: x, newScore: x})));
        }

        async getDifference() {
            const token = window.localStorage.getItem("token");
            this.scores = await request("/api/scores/difference", {token});
        }

        async init() {
            const queryToken = this.$route.query.token;
            if (typeof queryToken === "string") {
                window.localStorage.setItem("token", queryToken);
                const query = Object.assign({}, this.$route.query);
                delete query.token;
                this.$router.replace({query});
            }
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
            await this.getDifference();
            await this.getTotalDifference();
            this.ready = true;
        }

        mounted() {
            this.init();
        }
    }
</script>
