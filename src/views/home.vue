<template>
  <div class="background-container">
    <div class="home-container">
      <toolbar></toolbar>
      <div class="p">
        <imageblock />
      </div>
    </div>
  </div>
</template>

<script>
import toolbar from "@/components/toolbar.vue";
import imageblock from "@/components/image-block.vue";

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
.background-container {
  width: 100%;
  min-height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(45deg, #b6d0ee, #c1b0fc);

  .home-container {
    width: 1000px;
    min-height: 95%;
    background-color: white;
    border-radius: 5px;
    display: block;
    justify-content: center;
    text-align: center;
    box-shadow: 0px 0px 200px 35px rgba(82, 81, 81, 0.35);
  }
}

.p {
  padding-top: 300px;
  padding-bottom: 100px;
  padding-right: 10px;
  padding-left: 10px;
}
</style>
