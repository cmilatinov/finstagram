<template>
    <div id="app">
        <toolbar v-if="$route.name !== 'login' && $route.name !== 'register'"></toolbar>
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
    </div>
</template>

<script>
import toolbar from './components/toolbar';

export default {
    components: {
        toolbar
    },
    data() {
        return {
            navItems: ['Profile', 'Post a Picture', 'Logout']
        };
    }
}
</script>

<style lang="scss">
    @import './assets/style/global.scss';
</style>