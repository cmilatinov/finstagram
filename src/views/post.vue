<template>
  <div class="background-container">
      <div class="home-container">
         <testComponent></testComponent>
      </div>
  </div>
</template>

<script>
import testComponent from "../components/toolbar.vue";
export default {
  components: {
    testComponent
  },
  data() {
    return {};
  }
};
</script>

<style lang='scss'>
@import '../assets/style/homepage.scss';

</style>

