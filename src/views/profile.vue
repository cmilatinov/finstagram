<template>
  <div class="scroll-container">
    <b-jumbotron
      bg-variant="transparent"
      header-level="5"
      :header="profileduser.username"
    >
      <p>
        <template v-slot:lead>
          {{ profileduser.nbPosts }} POSTS &nbsp;
          {{ profileduser.nbFollowers }} FOLLOWERS &nbsp;
          {{ profileduser.nbFollowings }} FOLLOWING
        </template>
      </p>
      <b-button
        v-if="!this.profileduser.followed"
        variant="outline-primary"
        @click="onProfileButtonClick"
        >Follow</b-button
      >
      <b-button v-else variant="outline-primary" @click="onUnfollowClick">
        Unfollow
      </b-button>
    </b-jumbotron>
    <div><imagewall :posts="posts" /></div>
  </div>
</template>

<script>
import imagewall from "@/components/image-wall.vue";
import network from "@/helpers/network";

export default {
  components: {
    imagewall
  },

  data() {
    return {
      profileduser: {},
      posts: []
    };
  },
  mounted() {
    network
      .get(`/users/${this.$route.params.id}`, { withCredentials: true })
      .then(res => (this.profileduser = res.data));
    for (let i = 0; i < 5; i++)
      this.posts.push({
        id: i,
        caption: `HUGE`
      });
  },
  methods: {
    onProfileButtonClick() {
      network
        .post(
          "/users/follow",
          {
            userid: this.user.id,
            followerid: this.profileduser.id
          },
          { withCredentials: true }
        )
        .then(_ => this.profileduser.nbFollowers++)
        .catch(_ =>
          this.$swal({
            title: "Follow Failed",
            text: "Could not follow user.",
            icon: "error"
          })
        );
    },
    onUnfollowClick() {
      network
        .post(
          "/users/unfollow",
          {
            userid: this.user.id,
            followerid: this.profileduser.id
          },
          { withCredentials: true }
        )
        .then(_ => this.profileduser.nbFollowers--)
        .catch(_ =>
          this.$swal({
            title: "Unfollow Failed",
            text: "Could not unfollow user.",
            icon: "error"
          })
        );
    }
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
