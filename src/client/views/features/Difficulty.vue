<template>
    <div>
        <div class="item">
            <h2>適正難易度</h2>
            <p>該当の曲で指定されたスコアを取る難しさをレートとして表示します。</p>
            <p class="input-name">曲名</p>
            <p><input type="text" v-model="songName"></p>
            <p class="input-name">スコア</p>
            <p><input type="text" v-model="score"></p>
            <p><input type="button" @click="submit()" value="算出"></p>
            <p class="center">{{result}}</p>
        </div>
        <div class="overlay" v-if="dialog" @click="dialog=false">
            <div class="dialog">
                <p v-for="song in songs" :key="song.songId">
                    <a href="javascript:void(0)" @click="difficulty(song)">{{song.songName}}</a>
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import request from "../../lib/request";
    import {Song} from "../../../models/song";
    import {scoreToInteger, integerToRate} from "../../../helper/formatter";

    @Component
    export default class extends Vue {
        songName = "";
        score = "";
        result = "";
        songs: Song[] = [];
        dialog = false;

        async submit() {
            if (this.songName === "") {
                return;
            }

            this.songs = await request("/api/songs/search", {
                query: this.songName
            });

            if (this.songs.length === 1) {
                this.difficulty(this.songs[0]);
                return;
            }

            if (this.songs.length === 0) {
                alert("曲が見つかりませんでした。");
                return;
            }

            this.dialog = true;
        }

        async difficulty(song: Song) {
            this.dialog = false;

            const difficulty = await request("/api/songs/difficulty", {
                songId: song.songId,
                score: scoreToInteger(this.score)
            });

            this.result = `${song.songName}: ${integerToRate(difficulty)}`;
        }
    }
</script>

