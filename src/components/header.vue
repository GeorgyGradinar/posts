<template>

  <button @click="openCreatePost">Create new post</button>

</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "header",

  methods:{
    openCreatePost() {
      this.$router.push('/create-edit-post')
    },
  }
}
</script>

<style scoped>

</style>
