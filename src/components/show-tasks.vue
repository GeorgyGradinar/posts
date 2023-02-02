<template>

  <div class="wrap-new-article" v-for="post in posts" :key="post.id">
    <div class="wrap-article">

      <h1>{{ post.title }}</h1>
      <h3>{{ post.text }}</h3>

      <img src="../assets/edit.svg" @click="openEditPost(post.fireBaseUrl)">
      <img src="../assets/delete.svg" @click="removePost(post)">

      <div v-if="post.images.length">
        <div class="wrap-img" v-for="image in post.images" :key="image.id">
          <img class="img" :src="image.url" alt="" @click="isShowImg(true)"/>
        </div>
      </div>

      <show-images class="show-img" v-if="isOpenShowImg"
                   :images="post.images"
                   @closeShowImg="isShowImg">
      </show-images>

    </div>
  </div>

</template>

<script>

import showImages from "@/components/show-images/show-images";
import {fireBaseMixins} from "@/requests/firebase-requests";

export default {
  components: {
    showImages,
  },

  created() {
    this.posts = this.$store.state.posts;
  },

  data() {
    return {
      posts: [],
      isOpenShowImg: false,
    }
  },

  watch: {
    '$store.state.posts'() {
      this.posts = this.$store.state.posts;
    }
  },

  methods: {

    isShowImg(isOpen) {
      this.isOpenShowImg = isOpen;
    },

    openEditPost(id) {
      this.$router.push(`/create-edit-post/${id}`);
    },

    removePost(post) {
      fireBaseMixins.methods.removePost({firebase: post.fireBaseUrl, id: post.id, images: post.images});
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
