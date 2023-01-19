<template>
  <div class="wrap-article">

    <h1>{{ this.$store.state.articles[this.index].title }}</h1>
    <h3>{{ this.$store.state.articles[this.index].text }}</h3>

    <img src="../assets/edit.svg" @click="isOpenMenuEdit(true)">
    <img src="../assets/delete.svg" @click="removeArticle">

    <div v-if="this.imagesArticle">
      <div class="wrap-img" v-for="object in this.imagesArticle" :key="object.id">
        <img class="img" :src="object.url" alt="" @click="isShowImg(true)"/>
      </div>
    </div>

    <show-images class="showImg" v-if="isOpenShowImg" :images="this.imagesArticle"
                 @closeShowImg="isShowImg">
    </show-images>

    <edit-task class="showImg" v-if="isOpenEditMenu"
               :index="this.index"
               :titleArticle="titleArticle"
               :textArticle="textArticle"
               :imagesArticle="imagesArticle"
               :id='id'
               :fireBaseUrl="fireBaseUrl"
               @article='getEditArticle'
               @closePostBlock="isOpenMenuEdit">
    </edit-task>

  </div>
</template>

<script>
import showImages from "@/components/showImages";
import editTask from "@/components/add-task";

export default {
  components: {
    showImages,
    editTask

  },

  props: ['takeArticle', 'index'],

  created() {
    this.titleArticle = this.takeArticle.title
    this.textArticle = this.takeArticle.text
    this.imagesArticle = this.takeArticle.images
    this.id = this.takeArticle.id
    this.fireBaseUrl = this.takeArticle.fireBaseUrl
  },
  data() {
    return {
      titleArticle: this.$store.state.articles[this.index].title,
      textArticle: '',
      imagesArticle: '',
      id: null,
      fireBaseUrl: null,
      isOpenShowImg: false,
      isOpenEditMenu: false,
      mainPosts: this.$store.state.articles[this.index]
    }
  },

  methods: {
    isShowImg(isOpen) {
      this.isOpenShowImg = isOpen
    },

    isOpenMenuEdit(isOpen) {
      this.isOpenEditMenu = isOpen
    },

    removeArticle() {
      this.$store.commit('removePost', this.fireBaseUrl)
    },

    getEditArticle(article) {
      this.titleArticle = article.title
      this.textArticle = article.text
      this.imagesArticle = article.images
      this.id = article.id
      this.$emit('getEditArticle', {
        title: this.titleArticle,
        text: this.textArticle,
        images: this.imagesArticle,
        id: this.id,
      })
    }
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

.showImg {
  position: absolute;
  top: 0;
  left: 0;
}

</style>
