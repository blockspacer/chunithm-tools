<template>
    <div v-if="ready">
        <div class="item">
            <h2>ライバル</h2>
            <p>他のCHUNITHM Toolsユーザーとスコアを比較します。</p>
            <ul>
                <li v-for="rival of rivals" :key="rival.rivalCode">
                    <router-link :to="`/rivalcomp/${rival.rivalCode}`">{{rival.playerName}}</router-link>
                </li>
            </ul>
        </div>
        <div class="item">
            <h2>ライバルランキング</h2>
            <p><input type="text" v-model="songName"></p>
            <p><select v-model="difficulty">
                <option :value="Difficulty.MASTER">MASTER</option>
                <option :value="Difficulty.EXPERT">EXPERT</option>
                <option :value="Difficulty.ADVANCED">ADVANCED</option>
                <option :value="Difficulty.BASIC">BASIC</option>
            </select></p>
            <p><input type="button" value="表示" @click="submit()"></p>
            <p>{{resultName}}</p>
            <p v-for="score in ranking" :key="`${score.playerName}`">
                {{score.playerName}}: {{score.score}}
            </p>
        </div>
        <div class="overlay" v-if="dialog" @click="dialog=false">
            <div class="dialog">
                <p v-for="song in songs" :key="song.songId">
                    <a href="javascript:void(0)" @click="showRank(song)">{{song.songName}}</a>
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import request from "../../lib/request";
    import {Difficulty} from "../../../models/difficulty";
    import {RankingScore} from "../../../models/ranking_score";
    import {Rival} from "../../../models/rival";
    import {Song} from "../../../models/song";
    import {integerToRateValue} from '../../../helper/formatter';

    @Component
    export default class extends Vue {
        ready = false;
        dialog = false;
        songName = "";
        resultName = "";
        difficulty: Difficulty = Difficulty.MASTER;
        ranking: RankingScore[] = [];
        songs: Song[] = [];
        rivals: Rival[] = [];

        integerToRateValue = integerToRateValue;
        Difficulty = Difficulty;

        async submit() {
            this.songs = await request("/api/songs/search", {
                query: this.songName
            });

            if (this.songs.length === 1) {
                await this.showRank(this.songs[0]);
                return;
            }

            if (this.songs.length === 0) {
                alert("曲が見つかりませんでした。");
                return;
            }

            this.dialog = true;
        }

        async showRank(song: Song) {
            const token = window.localStorage.getItem("token");

            this.ranking = await request("/api/rivals/ranking", {
                                                token,
                                                songId: song.songId,
                                                difficulty: this.difficulty
                                            });

            this.resultName = song.songName;
        }

        async getRivals() {
            const token = window.localStorage.getItem("token");

            this.rivals = await request("/api/rivals", {token});
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
            await this.getRivals();
            this.ready = true;
        }

        constructor() {
            super();
            this.init();
        }
    }
</script>
