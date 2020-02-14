import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from './views/home';
import Login from './views/login';
import Register from './views/register';
import Post from './views/post';

import store from './store';
import network from './helpers/network';

Vue.use(VueRouter);

function ifAuthenticated(to, from, next) {
    if(store.getters.isAuthenticated)
       return next();

    checkAuth()
    .then(auth => {
        if(auth)
            next();
        else
            next('/login');
    });
}

function ifNotAuthenticated(to, from, next) {
    if(store.getters.isAuthenticated)
        return next('/');

    checkAuth()
    .then(auth => {
        if(auth)
            next('/');
        else
            next();
    });
}

function checkAuth() {
    return new Promise(resolve => { 
        network.get('/users/current', { withCredentials: true })
        .then(res => {
            store.commit('authSuccess', res.data);
            resolve(true);
        })
        .catch(_ => resolve(false));
    });
}

export default new VueRouter({
    routes: [
        {
            name: 'index',
            path: '/',
            component: Home,
            beforeEnter: ifAuthenticated
        },
        {
            name: 'login',
            path: '/login',
            component: Login,
            beforeEnter: ifNotAuthenticated
        },
        {
            name: 'register',
            path: '/register',
            component: Register,
            beforeEnter: ifNotAuthenticated
        },
        {
            name: 'post',
            path: '/post',
            component: Post,
            beforeEnter: ifAuthenticated
        }
    ]
});
