<template>
    <div>
        <div class="item">
            <h2>スコア登録</h2>
            <p>単一のスコアを手動で登録します。</p>
            <p class="input-name">曲名</p>
            <p><input type="text" v-model="songName"></p>
            <p class="input-name">スコア</p>
            <p><input type="text" v-model="score"></p>
            <p class="input-name">難易度</p>
            <p><select v-model="difficulty">
                <option :value="Difficulty.BASIC">BASIC</option>
                <option :value="Difficulty.ADVANCED">ADVANCED</option>
                <option :value="Difficulty.EXPERT">EXPERT</option>
                <option :value="Difficulty.MASTER" selected>MASTER</option>
            </select></p>
            <p><input type="button" @click="submit(songName)" value="登録"></p>
            <p class="center">{{result}}</p>
        </div>
        <div class="overlay" v-if="dialog" @click="dialog=false">
            <div class="dialog">
                <p v-for="song in songs" :key="song.songId">
                    <a href="javascript:void(0)" @click="register(song)">{{song.songName}}</a>
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import request from "../../lib/request";
    import {Song} from "../../../models/song";
    import {scoreToInteger} from "../../../helper/formatter";
    import {Difficulty} from "../../../models/difficulty";

    @Component
    export default class extends Vue {
        songName = "";
        score = "";
        result = "";
        songs: Song[] = [];
        difficulty = Difficulty.MASTER;
        dialog = false;

        Difficulty = Difficulty;

        async submit() {

            if (this.songName === "") {
                return;
            }

            this.songs = await request("/api/songs/search", {
                query: this.songName
            });

            if (this.songs.length === 1) {
                await this.register(this.songs[0]);
                return;
            }

            if (this.songs.length === 0) {
                alert("曲が見つかりませんでした。");
                return;
            }

            this.dialog = true;
        }

        async register(song: Song) {
            const token = window.localStorage.getItem("token");
            this.dialog = false;

            const score = scoreToInteger(this.score);

            await request("/api/scores/set_single_score", {
                token: token,
                songId: song.songId,
                difficulty: this.difficulty,
                score: score
            });

            this.result = `${song.songName}: ${score}`;
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
        }

        mounted() {
            this.init();
        }
    }
</script>
