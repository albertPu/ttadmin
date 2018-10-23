import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
//import './assets/theme/theme-green/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import routes from './routes'
//import Mock from './mock'
    ;

//Mock.bootstrap();
import 'font-awesome/css/font-awesome.min.css'
import api from './api/api'
import util from './utlis/util'


Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(Vuex);


Vue.prototype.$http = api;


//NProgress.configure({ showSpinner: false });

const router = new VueRouter({
    routes
});

router.beforeEach((to, from, next) => {
    //NProgress.start();
    // if (to.path == '/login') {
    //     sessionStorage.removeItem('token');
    // }
    // let token = sessionStorage.getItem('token');
    // if (token == null && to.path != '/login') {
    //     next({path: '/login'})
    // } else {
    next()
    // }
});

//router.afterEach(transition => {
//NProgress.done();
//});

var vue = new Vue({
    //el: '#app',
    //template: '<App/>',
    router,
    store,
    //components: { App }
    render: h => h(App)
}).$mount('#app');

Vue.prototype.$utils = {
    showSuccess: function (msg) {
        vue.$message({
            message: msg,
            type: 'success'
        });
    },
    showError: function (msg) {
        vue.$message.error(msg);
    }

};

