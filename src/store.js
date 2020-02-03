import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
    },
    mutations: {
        authSuccess(_, user) {
            this.$session.start();
            Object.keys(user).forEach(key => this.$session.set(key, user[key]));
        } 
    },
    getters: {
    },
});
