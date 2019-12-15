<template>
    <div>
        <div class="item">
            <h2>ログイン</h2>
            <p class="input-name">ユーザーID</p>
            <p><input type="text" v-model="userid"></p>
            <p class="input-name">パスワード</p>
            <p><input type="password" v-model="password"></p>
            <p><input type="button" @click="signin()" value="ログイン"></p>
            <p class="center"><router-link to="/signup">アカウントを持っていません</router-link></p>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import request from "../lib/request";

    @Component
    export default class extends Vue {
        userid = "";
        password = "";

        async singin() {
            const token = await request("/api/users/signin", {
                                    userId: this.userid,
                                    password: this.password
                                });
            if (token === "") {
                alert("サインインに失敗しました。");
                return;
            }
            window.localStorage.setItem("token", token);
            this.$router.push("/");
        }
    }
</script>
