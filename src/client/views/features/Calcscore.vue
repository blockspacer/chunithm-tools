<template>
    <div>
        <div class="item">
            <h2>スコア計算</h2>
            <p>判定の数からスコアを計算します。</p>
            <p class="input-name">CRITICAL JUSTICE</p>
            <p><input type="text" v-model="critical"></p>
            <p class="input-name">CRITICAL</p>
            <p><input type="text" v-model="justice"></p>
            <p class="input-name">ATTACK</p>
            <p><input type="text" v-model="attack"></p>
            <p class="input-name">MISS</p>
            <p><input type="text" v-model="miss"></p>
            <p><input type="button" @click="calc()" value="算出"></p>
            <p class="center">{{score}}</p>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {calcScore} from "../../../helper/calculator";

    @Component
    export default class extends Vue {
        critical = "";
        justice = "";
        attack = "";
        miss = "";
        score = "";

        async calc() {
            this.score = String(Math.floor(
                            calcScore(
                                parseInt(this.critical),
                                parseInt(this.justice),
                                parseInt(this.attack),
                                parseInt(this.miss))));
        }
    }
</script>

