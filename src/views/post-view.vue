<template>
  <div class="scroll-container">
    <div class="content" v-if="post && !loading">
      <b-card body-bg-variant="border-white" class="card">
        <div class="post-container">
          <div class="post">
            <div style="flex: 1" />

            <div class="card-image">
              <b-card-img
                ref="image"
                v-viewer="{ navbar: false }"
                :src="post.image ? `${IMG_URL}/${post.image.id}` : ''"
                @load="computePostHeight"
              />
              <div
                class="image-overlay"
                @click="(_) => navigate(`/post-view/${post.id}`)"
              >
                <div
                  class="overlay-row"
                  :key="i"
                  v-for="i in (0, reactionRows)"
                >
                  <div
                    class="icon"
                    :class="{ active: post.reacted === reaction.id }"
                    :key="`${post.id}-${reaction.id}`"
                    v-for="reaction in getReactionRow(i - 1)"
                    @click.stop="
                      (_) =>
                        onReactToPost(
                          reaction.id === post.reacted ? null : reaction.id
                        )
                    "
                  >
                    <icon :icon="reaction.icon" />
                    <div class="hint">
                      {{ post.reactions[reaction.id] || 0 }}
                    </div>
                  </div>
                </div>
                <div class="fullscreen" @click="onClickFullscreen">
                  <icon icon="expand" />
                </div>
                <div
                  class="delete"
                  @click="onClickDelete"
                  v-if="user.id == post.user.id"
                >
                  <icon icon="trash-alt" />
                </div>
              </div>
            </div>

            <div style="flex: 1" />

            <div ref="caption" class="caption" v-if="post.image.caption !== ''">
              <i>{{ post.image.caption }}</i>
            </div>
          </div>

          <div class="right-container" :style="`height: ${postHeight}px`">
            <div class="user">
              Posted by
              <a :href="`#/profile/${post.user.id}`"
                ><strong
                  ><i>{{ post.user.username }}</i></strong
                ></a
              >
              <span style="float: right">{{ timePosted }}</span>
            </div>
            <div class="comments-container">
              <div
                class="comment"
                :key="comment.id"
                v-for="comment in post.comments"
              >
                <a :href="`#/profile/${post.user.id}`"
                  ><strong
                    ><i>{{ comment.username }}</i></strong
                  ></a
                >&nbsp;&nbsp;
                {{ comment.comment }}
                <div class="hint">{{ comment.timePosted }}</div>
              </div>
            </div>
            <div class="form-container">
              <b-textarea
                id="comment"
                v-model="comment"
                placeholder="Add a comment..."
                no-resize=""
              />
              <b-button
                :disabled="comment === '' || loadingComment"
                style="align-self: center"
                variant="outline-primary"
                @click="onPostComment"
                >Post</b-button
              >
            </div>
          </div>
        </div>
      </b-card>
    </div>
    <div class="content h-100" v-else-if="loading">
      <b-spinner variant="secondary" />
    </div>
    <div class="content h-100" v-else>
      <p>
        <i style="font-size: 1.3em; opacity: 0.6">This post does not exist.</i>
      </p>
    </div>
  </div>
</template>

<script>
import network from "@/helpers/network";
import utils from "@/helpers/utils";

export default {
  data() {
    return {
      post: null,
      postHeight: 0,
      IMG_URL: process.env.VUE_APP_IMG_URL,
      comment: "",
      loading: false,
      loadingComment: false,
      reactionRows: 2,
    };
  },
  activated() {
    this.refreshPost();
  },
  deactivated() {
    this.comment = "";
  },
  computed: {
    timePosted() {
      if (!this.post) return "";
      return utils.dateDiffFromNow(this.post.posted);
    },
    image() {
      if (!this.post) return "";
      return process.env.VUE_APP_API_URL + `/images/${this.post.image.id}`;
    },
  },
  methods: {
    getReactionRow(index) {
      let arr = [];
      for (
        let i = (this.reactions.length * index) / this.reactionRows;
        i < (this.reactions.length * (index + 1)) / this.reactionRows;
        i++
      )
        arr.push(this.reactions[i]);
      return arr;
    },
    refreshPost(id = null, showLoading = true) {
      return new Promise((resolve, reject) => {
        if (showLoading) this.loading = true;
        network
          .get(`/posts/${id ? id : this.$route.params.postid}`, {
            withCredentials: true,
          })
          .then((res) => {
            this.post = res.data;
            this.post.comments.forEach((comment) => {
              comment.timePosted = utils.dateDiffFromNow(comment.commented);
            });
            if (showLoading) this.loading = false;
            resolve();
          })
          .catch((_) => {
            if (showLoading) this.loading = false;
            reject();
          });
      });
    },
    onReactToPost(reactionid) {
      if (this.post.reacted === reactionid) return;

      network
        .post(
          "/posts/react",
          {
            postid: this.post.id,
            reactionid,
          },
          { withCredentials: true }
        )
        .then((res) => {
          this.post.reactions = res.data.reactions;
          this.post.reacted = reactionid;
        });
    },
    onPostComment() {
      if (this.comment === "") return;

      this.loadingComment = true;
      network
        .post(
          "/comments/new",
          {
            postid: this.post.id,
            comment: this.comment,
          },
          { withCredentials: true }
        )
        .then((res) => {
          this.post.comments = res.data.comments;
          this.post.comments.forEach((comment) => {
            comment.timePosted = utils.dateDiffFromNow(comment.commented);
          });
          this.comment = "";
          this.loadingComment = false;
        })
        .catch((err) => {
          this.$swal({
            title: "Posting Comment Failed",
            text:
              err.response && err.response.data
                ? err.response.data.error
                : "Could not post the specified comment.",
            icon: "error",
          });
          this.loadingComment = false;
        });
    },
    onClickFullscreen() {
      if (this.$refs.image) this.$refs.image.$viewer.show();
    },
    onClickDelete() {
      this.$swal(
        {
          title: "Are You Sure?",
          type: "warning",
          showCancelButton: true,
          confirmButtonClass: "btn-danger",
          confirmButtonText: "Delete",
          closeOnConfirm: false,
          closeOnCancel: false
        }
      ).then((result) => {
          if (result.value) {
            network
              .post(
                "/posts/delete",
                {
                  postid: this.post.id,
                },
                { withCredentials: true }
              )
              .then(
                this.$swal({
                  title: "Post Successfully Deleted",
                  text: "You will now be redirected to the homepage.",
                  icon: "success",
                }).then(_ => this.navigate(`/`))
              )
              .catch((err) => {
                this.$swal({
                  title: "Deleting Post Failed",
                  text:
                    err.response && err.response.data
                      ? err.response.data.error
                      : "Could not delete the specified post",
                  icon: "error",
                });
              });
          }
          else{
              this.$swal({title: "Succesfully Cancelled"});
          }
        })
    },
    computePostHeight() {
      this.postHeight = Math.max(
        (this.post.image.caption !== "" ? this.$refs.caption.offsetHeight : 0) +
          this.$refs.image.offsetHeight,
        600
      );
      this.$forceUpdate();
    },
  },
  watch: {
    "$route.params.postid": function(id) {
      if (!id) return;
      this.refreshPost(id);
    },
  },
};
</script>

<style lang="scss" scoped>
.scroll-container {
  flex: 1;
  overflow: auto;

  .content {
    width: 100%;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}

.post-container {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  flex-wrap: wrap;
  overflow: hidden;

  .post {
    flex: 2;
    min-width: 25rem;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #dfdfdf;
    margin-right: -1px;

    .card-image {
      position: relative;

      .image-overlay {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.7);
        opacity: 0;
        transition: 0.2s;
        border-radius: calc(0.25rem - 1px);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 0.5em;
        font-size: 2.5em;
        flex-wrap: wrap;

        .overlay-row {
          display: flex;
          flex-direction: row;
          justify-content: space-evenly;
          align-items: center;

          .icon {
            padding: 0.6em;
            display: flex;
            flex-direction: column;
            align-items: center;
            color: white;
            opacity: 0.6;
            transition: 0.1s;
            cursor: pointer;

            .hint {
              margin-top: 0.3em;
              font-size: 1rem;
            }

            &.active {
              color: #ffc107;
              opacity: 0.7;
            }

            &:hover {
              opacity: 1;
            }

            &:active {
              transform: translate(3px, 3px);
              opacity: 0.3;
            }
          }
        }

        .fullscreen {
          position: absolute;
          top: 0;
          right: 0;
          padding: 0.2em 0.6em;
          color: white;
          opacity: 0.6;
          transition: 0.1s;
          font-size: 0.8em;
          cursor: pointer;

          &:hover {
            opacity: 1;
          }
        }

        .delete {
          position: absolute;
          bottom: 0;
          right: 0;
          padding: 0.2em 0.6em;
          color: white;
          opacity: 0.6;
          transition: 0.1s;
          font-size: 0.8em;
          cursor: pointer;

          &:hover {
            color: red;
          }
        }

        &:hover {
          opacity: 1;
        }
      }
    }

    .caption {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 1.25rem;
      border-top: 1px solid rgba(0, 0, 0, 0.125);
    }
  }

  .right-container {
    flex: 1;
    min-width: 20rem;
    display: flex;
    flex-direction: column;

    .user {
      margin-top: -1px;
      padding: 1.25rem;
      border-top: 1px solid #dfdfdf;
      border-bottom: 1px solid rgba(0, 0, 0, 0.125);
    }

    .comments-container {
      flex: 1;
      min-height: 20rem;
      border-bottom: 1px solid rgba(0, 0, 0, 0.125);
      overflow: auto;

      .comment {
        margin: 1.25rem;

        .hint {
          font-size: 0.9em;
          color: rgba(0, 0, 0, 0.5);
          padding-top: 0.5rem;
        }
      }
    }

    .form-container {
      padding: 1rem 1.25rem;
      display: flex;
      flex-direction: row;
    }
  }
}

#comment {
  margin-right: 0.8rem;
}

.card {
  max-width: 70rem;
  margin: 3rem;

  & > * {
    padding: 0;
  }
}
</style>
