<template>
    <div v-if="ready" class="item">
        <h2>スコア一覧</h2>
        <details>
            <summary>フィルター</summary>
            <p class="input-name">最低難易度/譜面定数</p>
            <p><input type="text" v-model="minDifficulty"></p>
            <p class="input-name">最高難易度/譜面定数</p>
            <p><input type="text" v-model="maxDifficulty"></p>
            <p class="input-name">最低スコア</p>
            <p><input type="text" v-model="minScore"></p>
            <p class="input-name">最高スコア</p>
            <p><input type="text" v-model="maxScore"></p>
            <p class="input-name">難易度</p>
            <p><select v-model="difficulty">
                <option :value="null">指定なし</option>
                <option :value="Difficulty.BASIC">BASIC</option>
                <option :value="Difficulty.ADVANCED">ADVANCED</option>
                <option :value="Difficulty.EXPERT">EXPERT</option>
                <option :value="Difficulty.MASTER">MASTER</option>
            </select></p>
            <p class="input-name">ジャンル</p>
            <p><select v-model="genre">
                <option :value="null">指定なし</option>
                <option :value="Genre.POPS">POPS &amp; ANIME</option>
                <option :value="Genre.NICONICO">niconico</option>
                <option :value="Genre.TOUHOU">東方Project</option>
                <option :value="Genre.VARIETY">VARIETY</option>
                <option :value="Genre.IRODORI">イロドリミドリ</option>
                <option :value="Genre.KOTONOHA">ゲキマイ</option>
                <option :value="Genre.ORIGINAL">ORIGINAL</option>
            </select></p>
            <p><input type="button" value="表示" @click="filter()"></p>
        </details>
        <table>
            <tr>
                <td><a @click="sort('songname')" href="javascript:void(0);">曲名</a></td>
                <td><a @click="sort('difficulty')" href="javascript:void(0);">譜面定数</a></td>
                <td><a @click="sort('score')" href="javascript:void(0);">スコア</a></td>
                <td><a @click="sort('mark')" href="javascript:void(0);">ランプ</a></td>
            </tr>
            <tr v-for="score in scores" :key="`${score.song.songId}-${score.song.difficulty}`" :class="classes[score.song.difficulty]">
                <td>{{score.song.songName}}</td>
                <td>{{integerToRateValue(score.song.rateValue)}}</td>
                <td>{{score.score}}</td>
                <td>{{integerToScoreMark(score.mark)}}</td>
            </tr>
        </table>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import request from "../../lib/request";
    import {Score} from "../../../models/score";
    import {Difficulty} from "../../../models/difficulty";
    import {Genre} from "../../../models/genre";
    import {integerToRateValue, integerToScoreMark, difficultyToInteger, scoreToInteger} from '../../../helper/formatter';

    @Component
    export default class extends Vue {
        ready = false;
        scores: Score[] = [];
        readonly classes = ["basic", "advanced", "expert", "master"];

        private allScores: Score[] = [];
        private lastSortKey = "";

        minDifficulty = "1";
        maxDifficulty = "14";
        minScore = "1";
        maxScore = "1010000";
        difficulty: Difficulty | null = null;
        genre: Genre | null = null;

        Difficulty = Difficulty;
        Genre = Genre;
        integerToRateValue = integerToRateValue;
        integerToScoreMark = integerToScoreMark;

        sort(key: string) {
            const desc = key === this.lastSortKey;
            this.lastSortKey = desc ? "" : key;

            this.scores.sort((a, b) => {
                const c = key === "score"      ? a.score : 
                          key === "mark"       ? a.mark :
                          key === "difficulty" ? a.song.rateValue :
                          key === "songname"   ? a.song.songName : a.score;

                const d = key === "score"      ? b.score : 
                          key === "mark"       ? b.mark :
                          key === "difficulty" ? b.song.rateValue :
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
            const minDifficulty = difficultyToInteger(this.minDifficulty).min;
            const maxDifficulty = difficultyToInteger(this.maxDifficulty).max;
            const minScore = scoreToInteger(this.minScore);
            const maxScore = scoreToInteger(this.maxScore);
            const filter = (score: Score) => 
                                score.song.rateValue >= minDifficulty
                                && score.song.rateValue <= maxDifficulty
                                && score.score >= minScore
                                && score.score <= maxScore
                                && (this.difficulty === null || this.difficulty === score.song.difficulty)
                                && (this.genre === null || this.genre === score.song.genreId)

            this.scores = this.allScores.filter(filter);
        }

        async getScore() {
            const token = window.localStorage.getItem("token");
            const scores: Score[] = await request("/api/scores/get_scores", {token});
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

        constructor() {
            super();
            this.init();
        }
    }
</script>
