<template>
    <div>
        <div id="header">
            <img class="menuicon" src="/menu.png" @click="menu = !menu">
            <router-link to="/">
                <img class="icon" src="/chunithmtools2.png">
            </router-link>
        </div>
        <div id="main"><router-view></router-view></div>
        <div id="menu" @click="menu = !menu" :class="{visible: menu}"></div>
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