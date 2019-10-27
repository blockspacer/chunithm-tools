import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import NotFound from "./views/NotFound.vue";

Vue.use(Router);

const router = new Router({
    routes: [
        {path: "/", component: Home},
        {path: "*", component: NotFound}
    ]
});

export default router;
