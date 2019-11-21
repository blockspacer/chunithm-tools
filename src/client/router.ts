import Vue from "vue";
import Router from "vue-router";
import Border from "./views/features/Border.vue";
import Random from "./views/features/Random.vue";
import Home from "./views/Home.vue";
import NotFound from "./views/NotFound.vue";
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
        {path: "*", component: NotFound}
    ]
});

export default router;
