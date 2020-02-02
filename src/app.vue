<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
export default {
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

<style lang="scss" scoped>
</style>