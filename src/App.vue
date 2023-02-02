<template>

  <header_block></header_block>
  <router-view></router-view>

</template>

<script>

import header_block from "@/components/header";

export default {

  components: {
    header_block,
  },

  data() {
    return {
    }
  },

  mounted() {
    this.$store.commit('getPosts');
  },
}

</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

</style>
