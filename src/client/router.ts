import Vue from "vue";
import Router from "vue-router";
import Border from "./views/features/Border.vue";
import Calcscore from "./views/features/Calcscore.vue";
import Difficulty from "./views/features/Difficulty.vue";
import Random from "./views/features/Random.vue";
import Home from "./views/Home.vue";
import NotFound from "./views/NotFound.vue";
import Playerdata from "./views/profiles/Playerdata.vue";
import Scorehistory from "./views/profiles/Scorehistory.vue";
import Scorelist from "./views/profiles/Scorelist.vue";
import Signin from "./views/Signin.vue";
import Signup from "./views/Signup.vue";

Vue.use(Router);

const router = new Router({
    routes: [
        {path: "/", component: Home},
        {path: "/signin", component: Signin},
        {path: "/signup", component: Signup},
        {path: "/border", component: Border},
        {path: "/random", component: Random},
        {path: "/difficulty", component: Difficulty},
        {path: "/calcscore", component: Calcscore},
        {path: "/playerdata", component: Playerdata},
        {path: "/scorelist", component: Scorelist},
        {path: "/scorehistory", component: Scorehistory},
        {path: "*", component: NotFound}
    ]
});

export default router;
