<template>
    <div v-if="ready">
        <div class="item">
            <h2>設定</h2>
            <p>{{playerName}}としてログイン中です。</p>
            <p><input type="button" value="サインアウト" @click="signout()"></p>
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
        ready = false;

        signout() {
            window.localStorage.setItem("token", "");
            this.$router.push("/");
        }

        async getPlayer() {
            const token = window.localStorage.getItem("token");
            this.playerName = "";
            const player: Player = await request("/api/players/get_player", {token});
            this.ready = true;
            if (!validatePlayer(player)) {
                return;
            }
            this.playerName = player.playerName;
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
            await this.getPlayer();
        }

        mounted() {
            this.init();
        }
    }
</script>
