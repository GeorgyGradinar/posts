<template>

  <button @click="isOpenPostBlock('true')">Create new post</button>
  <task class="makeArticle"
        v-if="isCreatePostDialog"
        @article='postArticle'
        @closePostBlock='isOpenPostBlock'
        :editArticle="editArticle">

  </task>

  <div class="wrap-newArticle" v-for="(article, index) in this.$store.state.articles" :key="article.id">
    <show-tasks
        v-bind:takeArticle="article"
        :index="index"
        @getEditArticle="putArticle"
        @remove="removeArticle">

    </show-tasks>
  </div>


</template>

<script>

import task from "./components/add-task";
import showTasks from "@/components/showTasks";

export default {

  components: {
    task,
    showTasks
  },

  data() {
    return {
      isCreatePostDialog: false,
      articles: this.$store.state.articles,
      editArticle: []
    }
  },

  mounted() {
    this.$store.commit('getPosts')
  },


  methods: {


    isOpenPostBlock(isOpen) {
      this.isCreatePostDialog = isOpen
    },

    postArticle(data) {
      this.articles.push(data)
    },

    putArticle(article) {
      let editArticle = this.articles.filter(e => e.id === article.id)
      this.articles.splice(this.articles.indexOf(editArticle[0]), 1, article)
    },

    removeArticle(article) {
      let editArticle = this.articles.filter(e => e.id === article.id)
      this.articles.splice(this.articles.indexOf(editArticle[0]), 1)
    }
  }

}

</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.makeArticle {
  position: absolute;
  top: 0;
  z-index: 2;
}
</style>
