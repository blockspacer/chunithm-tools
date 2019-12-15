<template>
    <div v-if="ready" class="item">
        <h2>スコア比較</h2>
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
            <p>
                <input type="checkbox" id="WIN" v-model="win">
                <label>WIN</label>
            </p>
            <p>
                <input type="checkbox" id="DRAW" v-model="draw">
                <label>DRAW</label>
            </p>
            <p>
                <input type="checkbox" id="LOSE" v-model="lose">
                <label>LOSE</label>
            </p>
            <p><input type="button" value="表示" @click="filter()"></p>
        </details>
        <table>
            <tr>
                <td><a @click="sort('songname')" href="javascript:void(0);">曲名</a></td>
                <td><a @click="sort('myscore')" href="javascript:void(0);">自分</a></td>
                <td><a @click="sort('difference')" href="javascript:void(0);">差分</a></td>
                <td><a @click="sort('rivalscore')" href="javascript:void(0);">相手</a></td>
            </tr>
            <tr v-for="score in scores" :key="`${score.song.songId}-${score.song.difficulty}`" :class="classes[score.song.difficulty]">
                <td>{{score.song.songName}}</td>
                <td>{{score.myScore}}</td>
                <td class="small">{{`${signNumber(score.myScore - score.rivalScore)}`}}</td>
                <td>{{score.rivalScore}}</td>
            </tr>
        </table>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import request from "../../lib/request";
    import {RivalDifference} from "../../../models/rival_difference";
    import {Difficulty} from "../../../models/difficulty";
    import {Genre} from "../../../models/genre";
    import {difficultyToInteger, scoreToInteger} from '../../../helper/formatter';

    @Component
    export default class extends Vue {
        ready = false;
        scores: RivalDifference[] = [];
        readonly classes = ["basic", "advanced", "expert", "master"];

        private allScores: RivalDifference[] = [];
        private lastSortKey = "";

        minDifficulty = "1";
        maxDifficulty = "14";
        minScore = "1";
        maxScore = "1010000";
        win = true;
        draw = true;
        lose = true;
        difficulty: Difficulty | null = null;
        genre: Genre | null = null;

        Difficulty = Difficulty;
        Genre = Genre;

        sort(key: string) {
            const desc = key === this.lastSortKey;
            this.lastSortKey = desc ? "" : key;

            this.scores.sort((a, b) => {
                const c = key === "myscore"    ? a.myScore : 
                          key === "difference" ? a.myScore - a.rivalScore :
                          key === "rivalscore" ? a.rivalScore :
                          key === "songname"   ? a.song.songName : a.myScore;

                const d = key === "myscore"    ? b.myScore : 
                          key === "difference" ? b.myScore - b.rivalScore :
                          key === "rivalscore" ? b.rivalScore :
                          key === "songname"   ? b.song.songName : b.myScore;
                
                if (c > d) {
                    return desc ? -1 : 1;
                }

                if (c < d) {
                    return desc ? 1 : -1;
                }

                return 0;
            });
        }

        signNumber(num: number) {
            return `${num >= 0 ? "+" : ""}${num}`;
        }

        filter() {
            const minDifficulty = difficultyToInteger(this.minDifficulty).min;
            const maxDifficulty = difficultyToInteger(this.maxDifficulty).max;
            const minScore = scoreToInteger(this.minScore);
            const maxScore = scoreToInteger(this.maxScore);
            const filter = (score: RivalDifference) =>
                                score.song.rateValue >= minDifficulty
                                && score.song.rateValue <= maxDifficulty
                                && score.myScore >= minScore
                                && score.myScore <= maxScore
                                && score.rivalScore >= minScore
                                && score.rivalScore <= maxScore
                                && (this.difficulty === null || this.difficulty === score.song.difficulty)
                                && (this.genre === null || this.genre === score.song.genreId)
                                && (this.win && score.myScore > score.rivalScore
                                    || this.draw && score.myScore === score.rivalScore
                                    || this.lose && score.myScore < score.rivalScore);

            this.scores = this.allScores.filter(filter);
        }

        async getScore() {
            const token = window.localStorage.getItem("token");
            this.allScores = await request("/api/rivals/compare", {
                                                token: token,
                                                rivalCode: this.$route.params.rival
                                            });
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
