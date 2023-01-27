<template>

  <button @click="isOpenPostBlock(true)">Create new post</button>
  <task class="make-article"
        v-if="isCreatePostDialog"
        @closePostBlock="isOpenPostBlock">
  </task>

  <div class="wrap-new-article" v-for="(article, index) in this.articles" :key="article.id">
    <show-tasks
        :index="index">
    </show-tasks>
  </div>


</template>

<script>

import task from "./components/add-task";
import showTasks from "@/components/show-tasks";

export default {

  components: {
    task,
    showTasks,
  },

  data() {
    return {
      isCreatePostDialog: false,
      articles: this.$store.state.articles,
    }
  },

  watch: {
    '$store.state.articles'() {
      this.articles = this.$store.state.articles
    }
  },

  mounted() {
    this.$store.commit('getPosts');
  },

  methods: {

    isOpenPostBlock(isOpen) {
      this.isCreatePostDialog = isOpen;
    },

  }

}

</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.make-article {
  position: absolute;
  top: 0;
  z-index: 2;
}
</style>
