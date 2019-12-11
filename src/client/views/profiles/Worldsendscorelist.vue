<template>
    <div v-if="ready" class="item">
        <h2>WORLD'S ENDスコア一覧</h2>
        <details>
            <summary>フィルター</summary>
            <p class="input-name">最低難易度</p>
            <p><input type="text" v-model="minDifficulty"></p>
            <p class="input-name">最高難易度</p>
            <p><input type="text" v-model="maxDifficulty"></p>
            <p class="input-name">最低スコア</p>
            <p><input type="text" v-model="minScore"></p>
            <p class="input-name">最高スコア</p>
            <p><input type="text" v-model="maxScore"></p>
            <p class="input-name">難易度</p>
            <p><input type="button" value="表示" @click="filter()"></p>
        </details>
        <table>
            <tr>
                <td><a @click="sort('songname')" href="javascript:void(0);">曲名</a></td>
                <td><a @click="sort('difficulty')" href="javascript:void(0);">☆</a></td>
                <td><a @click="sort('score')" href="javascript:void(0);">スコア</a></td>
                <td><a @click="sort('mark')" href="javascript:void(0);">ランプ</a></td>
            </tr>
            <tr v-for="score in scores" :key="`${score.song.songId}`" class="worldsend">
                <td>{{score.song.songName}}</td>
                <td>{{score.song.difficulty}}</td>
                <td>{{score.score}}</td>
                <td>{{integerToScoreMark(score.mark)}}</td>
            </tr>
        </table>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import request from "../../lib/request";
    import {WorldsEndScore} from "../../../models/worldsendscore";
    import {integerToScoreMark, scoreToInteger} from '../../../helper/formatter';

    @Component
    export default class extends Vue {
        ready = false;
        scores: WorldsEndScore[] = [];

        private allScores: WorldsEndScore[] = [];
        private lastSortKey = "";

        minDifficulty = "1";
        maxDifficulty = "5";
        minScore = "1";
        maxScore = "1010000";

        integerToScoreMark = integerToScoreMark;

        sort(key: string) {
            const desc = key === this.lastSortKey;
            this.lastSortKey = desc ? "" : key;

            this.scores.sort((a, b) => {
                const c = key === "score"      ? a.score : 
                          key === "mark"       ? a.mark :
                          key === "difficulty" ? a.song.difficulty :
                          key === "songname"   ? a.song.songName : a.score;

                const d = key === "score"      ? b.score : 
                          key === "mark"       ? b.mark :
                          key === "difficulty" ? b.song.difficulty :
                          key === "songname"   ? b.song.songName : b.score;
                
                if (c > d) {
                    return desc ? -1 : 1;
                }

                if (c < d) {
                    return desc ? 1 : -1;
                }

                return 0;
            });
        }

        filter() {
            const minDifficulty = Number(this.minDifficulty);
            const maxDifficulty = Number(this.maxDifficulty);
            const minScore = scoreToInteger(this.minScore);
            const maxScore = scoreToInteger(this.maxScore);
            const filter = (score: WorldsEndScore) => 
                                score.song.difficulty >= minDifficulty
                                && score.song.difficulty <= maxDifficulty
                                && score.score >= minScore
                                && score.score <= maxScore

            this.scores = this.allScores.filter(filter);
        }

        async getScore() {
            const token = window.localStorage.getItem("token");
            const scores: WorldsEndScore[] = await request("/api/scores/worldsend/get_scores", {token});
            this.allScores = scores;
            this.filter();
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
