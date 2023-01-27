<template>
  <div class="wrap-article">

    <h1>{{ this.$store.state.articles[this.index].title }}</h1>
    <h3>{{ this.$store.state.articles[this.index].text }}</h3>

    <img src="../assets/edit.svg" @click="isOpenMenuEdit(true)">
    <img src="../assets/delete.svg" @click="removeArticle">

    <div v-if="this.$store.state.articles[this.index].images">
      <div class="wrap-img" v-for="object in this.$store.state.articles[this.index].images" :key="object.id">
        <img class="img" :src="object.url" alt="" @click="isShowImg(true)"/>
      </div>
    </div>

    <show-images class="show-img" v-if="isOpenShowImg" :images="this.$store.state.articles[this.index].images"
                 @closeShowImg="isShowImg">
    </show-images>

    <edit-task class="show-img" v-if="isOpenEditMenu"
               :index="this.index"
               @closePostBlock="isOpenMenuEdit">
    </edit-task>

  </div>
</template>

<script>

import showImages from "@/components/show-images";
import editTask from "@/components/add-task";
import {fireBaseMixins} from "@/store/firebase-requests";

export default {
  components: {
    showImages,
    editTask
  },

  props: ['index'],

  mounted() {

  },

  data() {
    return {
      isOpenShowImg: false,
      isOpenEditMenu: false,
      post: this.$store.state.articles[this.index]
    }
  },

  methods: {
    isShowImg(isOpen) {
      this.isOpenShowImg = isOpen;
    },

    isOpenMenuEdit(isOpen) {
      this.isOpenEditMenu = isOpen;
    },

    removeArticle() {
      fireBaseMixins.methods.removePost({firebase: this.post.fireBaseUrl, id: this.post.id, images:this.post.images});
    },

  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.wrap-img {
  position: relative;
  display: inline-block;
}

.img {
  width: 100px;
  height: 100px;
}

.wrap-article {
  width: 400px;
  height: 400px;
  background-color: darkgrey;
}

.show-img {
  position: absolute;
  top: 0;
  left: 0;
}

</style>
