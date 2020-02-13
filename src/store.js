import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: null
    },
    mutations: {
        authSuccess(state, user) {
            state.user = user;
        } 
    },
    getters: {
        isAuthenticated(state) {
            return state.user !== null;
        },
        user(state) {
            return state.user;
        }
    },
});
