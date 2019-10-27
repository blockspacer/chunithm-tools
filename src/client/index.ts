import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./static/favicon.ico";
import "./static/icon.png";
import "./static/index.html";
import "./static/menu.png";
import "./static/style.css";

new Vue({
    router,
    render: (h) => h(App)
}).$mount("#app");
