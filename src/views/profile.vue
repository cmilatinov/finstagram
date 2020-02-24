<template>
  <div class="scroll-container">
    <b-jumbotron bg-variant="transparent" header-level="5" :header="name">
      <template v-slot:lead>
        {{ nbPosts }} POSTS &nbsp; {{ nbFollowers }} FOLLOWERS &nbsp;
        {{ nbFollowing }} FOLLOWING
      </template>
    </b-jumbotron>
    <div><imagewall :posts="posts" /></div>
  </div>
</template>

<script>
import imagewall from "@/components/image-wall.vue";

export default {
  components: {
    imagewall
  },
  data() {
    return {
      name: "",
      nbFollowers: 0,
      nbFollowing: 0,
      nbPosts: 0,
      posts: []
    };
  },
  mounted() {
    this.name = "Donald Trump";
    this.nbFollowers = 0;
    for (let i = 0; i < 5; i++)
      this.posts.push({
        id: i,
        caption: `HUGE`
      });
  }
};
</script>

<style lang="scss">
.scroll-container {
  flex: 1;
  overflow: auto;
}
.jumbotron {
  margin: auto;
  text-align: center;
}
</style>
