<template>
    <div class="item">
        <h2>シェル</h2>
        <p>CHUNITHM Toolsシェル版のコマンドを実行します。</p>
        <p>helpで使い方を表示します。</p>
        <p><input type="text" v-model="command"></p>
        <p><input type="button" value="実行" @click="execute()"></p>
        <pre>{{result}}</pre>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import request from "../../lib/request";

    @Component
    export default class extends Vue {
        command: string = "";
        result: string = "";

        private token: string;

        async execute() {
            const result = await request("/api/shell", {
                                        token: this.token,
                                        command: this.command
                                    });
            this.result = result.join("\n");
        }

        async init() {
            const token = window.localStorage.getItem("token");
            if (token === null) {
                return;
            }
            const verify = await request("/api/users/verify_token", {token});
            if (verify.status === "FAILED") {
                return;
            }
            this.token = token;
        }

        mounted() {
            this.init();
        }
    }
</script>
