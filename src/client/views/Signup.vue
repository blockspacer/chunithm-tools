<template>
    <div>
        <div class="item">
            <h2>ユーザー登録</h2>
            <p class="input-name">ユーザーID</p>
            <p><input type="text" v-model="userid"></p>
            <p class="input-name error" v-show="!isUserIdValid">ユーザーIDには半角英数字のみを含むことができます。</p>
            <p class="input-name">パスワード</p>
            <p><input type="password" v-model="password"></p>
            <p class="input-name error" v-show="!isPasswordValid">パスワードには半角文字のみを含むことができます。</p>
            <p><input type="button" @click="signin()" value="登録"></p>
            <p class="center"><router-link to="/signin">既にアカウントを持っています</router-link></p>
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

        async signin() {
            const result = await request("/api/users/register", {
                                    userId: this.userid,
                                    password: this.password
                                });
            if (result.status !== "SUCCESS") {
                alert("登録に失敗しました。");
                return;
            }
            const token = await request("/api/users/signin", {
                                    userId: this.userid,
                                    password: this.password
                                });
            window.localStorage.setItem("token", token);
            this.$router.push("/");
        }

        get isUserIdValid() {
            return /^[a-zA-Z0-9]*$/.test(this.userid);
        }

        get isPasswordValid() {
            return /^[\x20-\x7E]*$/.test(this.password);
        }
    }
</script>
