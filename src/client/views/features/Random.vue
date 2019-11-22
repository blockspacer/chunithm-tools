<template>
    <div>
        <div class="item">
            <h2>ランダム選曲</h2>
            <p>指定された難易度の範囲内でランダムに曲を表示します。</p>
            <p class="input-name">最低難易度/譜面定数</p>
            <p><input type="text" v-model="min"></p>
            <p class="input-name">最高難易度/譜面定数</p>
            <p><input type="text" v-model="max"></p>
            <p class="input-name">曲数</p>
            <p><input type="text" v-model="count"></p>
            <p><input type="button" @click="random()" value="選曲"></p>
            <div>
                <p class="center" v-for="song in songs" :key="song.songId">
                    {{song.songName}}
                </p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import request from "../../lib/request";
    import {Song} from "../../../models/song";
    import {levelToInteger} from "../../../helper/formatter";

    @Component
    export default class extends Vue {
        min = "";
        max = "";
        count = "";
        songs: Song[] = [];

        async random() {
            this.songs = await request("/api/songs/random", {
                count: parseInt(this.count),
                minRateValue: levelToInteger(this.min).min,
                maxRateValue: levelToInteger(this.max).max
            });
        }
    }
</script>

