<template>
  <div class="background-container">
    <div class="post-container">
      <toolbar></toolbar>
      <div class="preview">
        <b-img width="500" height="500" v-if="url" :src="url" />
      </div>
      <div class="p">
        <b-form-textarea
          id="caption"
          v-model="caption"
          placeholder="CAPTION THIS..."
          rows="2"
        />
      </div>
      <div class="p">
        <b-form-file
          id="sexyimage"
          v-model="sexyimage"
          accept="image/*"
          placeholder="Choose a picture..."
          @change="onFileChange"
        />
        <b-button
          style="margin-top:10px"
          variant="outline-primary"
          @click="onPostPicture"
          >POST!</b-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import toolbar from "@/components/toolbar.vue";
import network from "@/helpers/network.js";
export default {
  data() {
    return { url: null, caption: null, sexyimage: null };
  },
  components: {
    toolbar
  },
  methods: {
    onFileChange(e) {
      const file = e.target.files[0];
      this.url = URL.createObjectURL(file);
    }
    // async onPostPicture(){
    //   network.post('',{
    //     sexyimage: this.sexyimage,
    //     caption: this.caption
    //   })
    // }
  }
};
</script>

<style lang="scss">
.background-container {
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(45deg, #b6d0ee, #c1b0fc);

  .post-container {
    width: 1000px;
    height: 99%;
    background-color: white;
    border-radius: 5px;
    overflow-x: hidden;
    display: block;
    justify-content: center;
    text-align: center;
    box-shadow: 0px 0px 200px 35px rgba(82, 81, 81, 0.35);
  }
}
.p {
  padding-top: 5%;
  padding-right: 10%;
  padding-left: 10%;
}
.preview {
  padding-top: 10%;
  justify-content: center;
  align-items: center;
}
</style>
