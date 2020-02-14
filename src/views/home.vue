// import navigation-bar from "../components/toolbar.vue" // new Vue({ // el:
'#background-container' // })

<template>
  <div class="background-container">
    <div class="home-container">
      <toolbar></toolbar>
      <div class='p'>
        <imageblock/>
                <imageblock/>
        <imageblock/>

      </div>
    </div>
  </div>
</template>

<script>
import toolbar from "../components/toolbar.vue";
import imageblock from "../components/image-block.vue";

export default {
  components: {
    toolbar,
    imageblock
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss">
@import "../assets/style/homepage.scss";

.p {
  padding-top:50px;
  padding-bottom:100px;
  padding-right:10px;
  padding-left:10px;

}
</style>
