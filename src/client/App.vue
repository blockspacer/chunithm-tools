<template>
    <div>
        <div id="header">
            <img class="menuicon" src="/menu.png" @click="menu = !menu">
            <router-link to="/">
                <img class="icon" src="/chunithmtools2.png">
            </router-link>
        </div>
        <div id="main"><router-view></router-view></div>
        <div id="menu" @click="menu = !menu" :class="{visible: menu}">
            <h2>機能一覧</h2>
            <ul>
                <li><router-link to="/border">ボーダー算出</router-link></li>
                <li><router-link to="/random">ランダム選曲</router-link></li>
                <li><router-link to="/difficulty">適正難易度</router-link></li>
                <li><router-link to="/calcscore">スコア計算</router-link></li>
            </ul>
            <p><b>ログイン必須</b></p>
            <ul>
                <li><router-link to="/playerdata">プレイヤーデータ</router-link></li>
                <li><router-link to="/scorelist">スコア一覧</router-link></li>
                <li><router-link to="/scorehistory">スコア履歴</router-link></li>
                <li><router-link to="/recommend">リコメンド</router-link></li>
                <li><router-link to="/registerscore">スコア登録</router-link></li>
                <li><router-link to="/difference">更新差分</router-link></li>
                <li><router-link to="/worldsendscorelist">WORLD'S ENDスコア一覧</router-link></li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";

    export default Vue.extend({
        data() {
            return {
                menu: false
            }
        }
    });
</script>

<style scoped>
    #menu {
        position: fixed;
        width: 280px;
        height: calc(100% - 70px);
        top: 0;
        right: 100%;
        padding: 70px 20px 0;
        transition-duration: 0.5s;
        background-color: #fff;
        border-right: 1px solid #888;
        overflow-y: scroll;
    }

    #menu.visible {
        right: calc(100% - 320px);
    }

    #main {
        position: absolute;
        width: 100%;
        top: 70px;
        left: 0;
    }

    #header {
        padding: 0;
        width: 100%;
        height: 70px;
        position: fixed !important;
        position: absolute;
        top: 0;
        left: 0;
        background-color: #000;
        color: #fff;
        font-size: 45px;
        z-index: 999;
    }

    .icon {
        position: absolute;
        margin: 0;
        left: calc(50% - 25px);
        top: 10px;
        width: 50px;
        height: 50px;
    }

    .menuicon {
        position: absolute;
        margin: 0;
        left: 0;
        top: 10px;
        width: 50px;
        height: 50px;
    }
</style>
