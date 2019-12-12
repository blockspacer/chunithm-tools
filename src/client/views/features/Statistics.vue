<template>
    <div>
        <div class="item">
            <h2>統計</h2>
            <p>曲の統計情報を表示します。</p>
            <p class="input-name">曲名</p>
            <p><input type="text" v-model="songName"></p>
            <p><input type="button" @click="submit()" value="表示"></p>
            <div v-if="ready">
                <p class="center">{{resultName}}</p>
                <pie-chart :chart-data="scoreData" :chart-options="scoreOptions" :height="200"></pie-chart>
                <line-chart :chart-data="rateData" :chart-options="rateOptions" :height="200"></line-chart>
            </div>
        </div>
        <div class="overlay" v-if="dialog" @click="dialog=false">
            <div class="dialog">
                <p v-for="song in songs" :key="song.songId">
                    <a href="javascript:void(0)" @click="stat(song)">{{song.songName}}</a>
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import request from "../../lib/request";
    import {Song} from "../../../models/song";
    import PieChart from "../../components/PieChart.vue";
    import LineChart from "../../components/LineChart.vue";
    import * as Chart from "chart.js";
    import {integerToRate} from "../../../helper/formatter";

    @Component({
        components: {
            PieChart, LineChart
        }
    })
    export default class extends Vue {
        songName = "";
        songs: Song[] = [];
        dialog = false;
        ready = false;
        resultName = "";
        rateData: Chart.ChartData = {};
        rateOptions: Chart.ChartOptions = {
            legend: {
                display: false
            },
            scales: {
                yAxes: [{
                    gridLines: {
                        color: "#000"
                    },
                    ticks: {
                        fontColor: "#000"
                    }
                }],
                xAxes: [{
                    gridLines: {
                        display: false,
                        color: "#000"
                    },
                    ticks: {
                        fontColor: "#000"
                    }
                }],
            }
        };
        scoreData: Chart.ChartData = {};
        scoreOptions: Chart.ChartOptions = {
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        const dataset = data.datasets![tooltipItem.datasetIndex!];
                        const total = (dataset.data as number[]).reduce(function(prev, current) {
                            return prev + current;
                        });
                        const current = dataset.data![tooltipItem.index!] as number;
                        return data.labels![tooltipItem.index!] + ": " + String(current) + "(" + ((current / total) * 100).toFixed(2) + "%)"
                    }
                }
            }
        };

        async submit() {
            if (this.songName === "") {
                return;
            }

            this.songs = await request("/api/songs/search", {
                query: this.songName
            });

            if (this.songs.length === 1) {
                this.stat(this.songs[0]);
                return;
            }

            if (this.songs.length === 0) {
                alert("曲が見つかりませんでした。");
                return;
            }

            this.dialog = true;
        }

        async stat(song: Song) {
            this.dialog = false;

            const result = await request("/api/songs/statistics", {
                songId: song.songId,
            }) as {count: [number, number][], stat: [number, number][]};

            this.scoreData = {
                labels: ["SSS", "SS+", "SS", "S", "S未満"],
                datasets: [
                    {
                        label: "ランク",
                        data: result.count.map((score) => score[1]),
                        backgroundColor: [
                            "#FF0000",
                            "#EEEE00",
                            "#00DD00",
                            "#00CCCC",
                            "#0000BB"
                        ]
                    }
                ]
            };

            this.resultName = song.songName;

            this.rateData = {
                labels: result.stat.map((score) => integerToRate(score[0])),
                datasets: [
                    {
                        label: "スコア",
                        hoverBackgroundColor: "#000",
                        data: result.stat.map((score) => score[1]),
                        borderColor: "#000",
                        pointRadius: 0,
                        pointHoverRadius: 5,
                        pointHitRadius: 20
                    }
                ]
            };

            this.ready = true;
        }
    }
</script>

