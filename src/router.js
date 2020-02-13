import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from './views/home';
import Login from './views/login';
import Post from './views/post';

Vue.use(VueRouter);

export default new VueRouter({
    routes: [
        {
            name: 'index',
            path: '/',
            component: Home
        },
        {
            name: 'login',
            path: '/login',
            component: Login
        },
        {
            name: 'post',
            path: '/post',
            component: Post
        }
    ]
});
