<template>
    <div v-if="ready">
        <div class="item">
            <h1>設定</h1>
            <p>{{playerName}}としてログイン中です。</p>
            <p><input type="button" value="サインアウト" @click="signout()"></p>
        </div>
        <div class="item">
            <h2>Twitter連携</h2>
            <p>連携中のTwitterアカウント: {{displayName}}</p>
            <p><input type="button" value="連携" @click="link()"></p>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import request from "../../lib/request";
    import {validatePlayer, Player} from '../../../models/player';

    @Component
    export default class extends Vue {
        playerName = "";
        displayName = "";
        ready = false;

        signout() {
            window.localStorage.setItem("token", "");
            this.$router.push("/");
        }

        link() {
            window.location.href = "/auth/link";
        }

        async getPlayer() {
            const token = window.localStorage.getItem("token");
            this.playerName = "";
            const player: Player = await request("/api/players/get_player", {token});
            if (!validatePlayer(player)) {
                return;
            }
            this.playerName = player.playerName;
        }

        async getDisplayName() {
            const token = window.localStorage.getItem("token");
            this.displayName = await request("/api/twitter/display_name", {token});
        }

        async init() {
            const token = window.localStorage.getItem("token");
            const twitterToken = this.$route.query.twitter;
            if (typeof twitterToken === "string") {
                await request("/api/twitter/enable_token", {token, twitterToken});
            }
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
            await this.getPlayer();
            await this.getDisplayName();
            this.ready = true;
        }

        mounted() {
            this.init();
        }
    }
</script>
