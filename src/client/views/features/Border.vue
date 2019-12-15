<template>
    <div>
        <div class="item">
            <h2>ボーダー算出</h2>
            <p>該当の曲/ノーツ数で指定されたスコアを取るために出せる最大のJUSTICE-ATTACK数を表示します。</p>
            <p class="input-name">曲名/ノーツ数</p>
            <p><input type="text" v-model="songName"></p>
            <p class="input-name">スコア</p>
            <p><input type="text" v-model="score"></p>
            <p><input type="button" @click="border(songName)" value="算出"></p>
            <p class="center">{{resultName}}</p>
            <div>
                <p class="center" v-for="border in borders" :key="border.attack">{{border.justice}}-{{border.attack}}</p>
            </div>
        </div>
        <div class="overlay" v-if="dialog" @click="dialog=false">
            <div class="dialog">
                <p v-for="song in songs" :key="song.songId">
                    <a href="javascript:void(0)" @click="songBorder(song)">{{song.songName}}</a>
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import request from "../../lib/request";
    import {Song} from "../../../models/song";
    import {Border} from "../../../models/border";
    import {calcBorder} from "../../../helper/calculator";
    import {scoreToInteger} from "../../../helper/formatter";

    @Component
    export default class extends Vue {
        songName = "";
        score = "";
        resultName = "";
        borders: Border[] = [];
        songs: Song[] = [];
        dialog = false;

        async border() {
            if (this.songName === "") {
                return;
            }

            if (/^[0-9]+$/.test(this.songName)) {
                this.resultName = `${this.songName} notes`;
                this.borders = calcBorder(parseInt(this.songName), scoreToInteger(this.score));
                return;
            }

            this.songs = await request("/api/songs/search", {
                query: this.songName
            });

            if (this.songs.length === 1) {
                this.songBorder(this.songs[0]);
                return;
            }

            if (this.songs.length === 0) {
                alert("曲が見つかりませんでした。");
                return;
            }

            this.dialog = true;
        }

        async songBorder(song: Song) {
            this.dialog = false;

            this.resultName = song.songName;
            this.borders = calcBorder(song.notes, scoreToInteger(this.score));
        }
    }
</script>

