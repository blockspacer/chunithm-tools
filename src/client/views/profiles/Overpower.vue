<template>
    <div v-if="ready" class="item">
        <h2>オーバーパワー</h2>
        <p>条件</p>
        <p class="input-name">最低難易度/譜面定数</p>
        <p><input type="text" v-model="minDifficulty"></p>
        <p class="input-name">最高難易度/譜面定数</p>
        <p><input type="text" v-model="maxDifficulty"></p>
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
        <p><input type="button" value="算出" @click="calc()"></p>
        <div v-if="overPower">
            <p>オーバーパワー: {{overPower}}</p>
            <p>SSS: {{chart[0][0]}} SS: {{chart[0][1]}} S: {{chart[0][2]}} OTHER: {{chart[0][3]}}</p>
            <horizontal-bar-chart :chart-data="rankData" :chart-options="options" :height="50"></horizontal-bar-chart>
            <p>AJ: {{chart[1][2]}} FC: {{chart[1][1]}} OTHERS: {{chart[1][0]}}</p>
            <horizontal-bar-chart :chart-data="lampData" :chart-options="options" :height="50"></horizontal-bar-chart>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import request from "../../lib/request";
    import {Score} from "../../../models/score";
    import {Difficulty} from "../../../models/difficulty";
    import {Genre} from "../../../models/genre";
    import {integerToRate, difficultyToInteger} from '../../../helper/formatter';
    import {calcOverPower} from '../../../helper/calculator';
    import HorizontalBarChart from "../../components/HorizontalBarChart.vue";

    @Component({
        components: {
            HorizontalBarChart
        }
    })
    export default class extends Vue {
        ready = false;
        chart: number[][] = [[0, 0, 0, 0], [0, 0, 0]];
        readonly classes = ["basic", "advanced", "expert", "master"];

        private scores: Score[] = [];

        minDifficulty = "1";
        maxDifficulty = "14";
        difficulty: Difficulty | null = null;
        genre: Genre | null = null;
        overPower = "";
        options: Chart.ChartOptions = {
            scales: {
                xAxes: [{
                    stacked: true,
                    display: false
                }],
                yAxes: [{
                    stacked: true,
                    display: false,
                    ticks: {
                        max: 0
                    }
                }]
            },
            tooltips: {
                enabled: false
            }
        };
        rankData: Chart.ChartData = {};
        lampData: Chart.ChartData = {};

        Difficulty = Difficulty;
        Genre = Genre;

        calc() {
            const minDifficulty = difficultyToInteger(this.minDifficulty).min;
            const maxDifficulty = difficultyToInteger(this.maxDifficulty).max;
            const filter = (score: Score) => 
                                score.song.rateValue >= minDifficulty
                                && score.song.rateValue <= maxDifficulty
                                && (this.difficulty === null || this.difficulty === score.song.difficulty)
                                && (this.genre === null || this.genre === score.song.genreId)

            const filtered = this.scores.filter(filter);
            const overPower = filtered.reduce<number>(
                                            (acc, score) => acc + calcOverPower(score.song.rateValue, score.score, score.mark), 0);

            this.overPower = integerToRate(overPower);

            const chart = filtered.reduce<number[][]>(
                                            (acc, score) => {
                                                switch (true) {
                                                    case score.score >= 1007500:
                                                        acc[0][0]++;
                                                        break;
                                                    case score.score >= 1000000:
                                                        acc[0][1]++;
                                                        break;
                                                    case score.score >= 975000:
                                                        acc[0][2]++;
                                                        break;
                                                    default:
                                                        acc[0][3]++;
                                                        break;
                                                }
                                                acc[1][score.mark % 3]++;
                                                return acc;
                                            },
                                            [[0, 0, 0, 0], [0, 0, 0]]);

            this.rankData = {
                datasets: [
                    {
                        backgroundColor: "#FE8",
                        label: "SSS",
                        data: [chart[0][0]]
                    },
                    {
                        backgroundColor: "#FC0",
                        label: "SS",
                        data: [chart[0][1]]
                    },
                    {
                        backgroundColor: "#89A",
                        label: "S",
                        data: [chart[0][2]]
                    },
                    {
                        backgroundColor: "#333",
                        label: "OTHER",
                        data: [chart[0][3]]
                    },
                ]
            };

            this.lampData = {
                datasets: [
                    {
                        backgroundColor: "#FE8",
                        label: "ALL JUSTICE",
                        data: [chart[1][2]]
                    },
                    {
                        backgroundColor: "#FC0",
                        label: "FULLCOMBO",
                        data: [chart[1][1]]
                    },
                    {
                        backgroundColor: "#333",
                        label: "OTHER",
                        data: [chart[1][0]]
                    },
                ]
            };

            this.chart = chart;
            this.options.scales!.yAxes![0].ticks!.max = filtered.length;
        }

        async getScore() {
            const token = window.localStorage.getItem("token");
            const scores: Score[] = await request("/api/scores/get_scores", {token});
            this.scores = scores;
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
