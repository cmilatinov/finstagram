<template>
    <div id="app">
        <toolbar v-if="$route.name !== 'login' && $route.name !== 'register'" @click="onClickNav"></toolbar>
        <keep-alive>
            <router-view ref="view"></router-view>
        </keep-alive>
    </div>
</template>

<script>
import toolbar from '@/components/toolbar';
import network from '@/helpers/network';

export default {
    components: {
        toolbar
    },
    data() {
        return {
            navItems: ['Profile', 'Post a Picture', 'Logout']
        };
    },
    mounted() {
        network.get('/reactions/all')
            .then(res => this.$store.commit('storeReactions', res.data.reactions));
    },
    methods: {
        onClickNav(){
            if(this.$refs.view && this.$refs.view.refresh)
                this.$refs.view.refresh();
        }
    }
}
</script>

<style lang="scss">
    @import './assets/style/global.scss';
</style>