import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: null,
        reactions: []
    },
    mutations: {
        logoutSuccess(state) {
            state.user = null;
        },
        authSuccess(state, user) {
            state.user = user;
        },
        storeReactions(state, reactions) {
            state.reactions = reactions;
        }
    },
    getters: {
        isAuthenticated(state) {
            return state.user !== null;
        },
        user(state) {
            return state.user;
        },
        reactions(state) {
            return state.reactions;
        }
    },
});
