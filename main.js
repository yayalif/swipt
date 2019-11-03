import Vue from "vue"
import routes from './route/';
import VueRouter from "vue-router";
import './pulldown.js'
import './swipeLeft.js'
import App from "./App";
Vue.use(VueRouter);

const router = new VueRouter({
    routes
});

new Vue({
    router,
    render: h => h(App)
}).$mount("#app");