import Vue from "vue";
import App from "./App.vue";

(() => {
    const host = window.location.host;
    if (host !== "chunithm-net.com") {
        alert("CHUNITHM-NETでブックマークレットを開いてください");
        return;
    }
    const url = window.location.href;
    if (url !== "https://chunithm-net.com/mobile/home/") {
        alert("出来る限りホームでブックマークレットを開いてください。\n"
              + "途中で取得に失敗する可能性があります。");
    }
    const div = document.createElement("div");
    div.setAttribute("id", "bkl");
    document.body.appendChild(div);
    new Vue({
        render: (h) => h(App)
    }).$mount("#bkl");
})();
