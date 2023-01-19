<template>
  <div class="wrap-image" id="main-block" @click="closeShow($event)">

    <img class="last" src="../assets/lastImg.svg" @click="lastImg" id="last-button">
    <img :src="this.image[this.index]" alt="" id="img">
    <img class="next" src="../assets/nextImg.svg" @click="nextImg" id="next-button">

  </div>
</template>

<script>
export default {

  props: ['images'],

  created() {
    this.image = this.images
  },

  data() {
    return {
      index: 0,
      image: [],
      targets: ['last-button', 'img', 'next-button'],
    }
  },

  methods: {
    nextImg() {
      if (this.index >= this.image.length - 1) {
        this.index = 0
      } else {
        this.index++
      }
    },

    lastImg() {
      if (this.index <= 0) {
        this.index = this.image.length - 1
      } else {
        this.index--
      }
    },

    closeShow(event) {
      if (!this.targets.includes(event.target.id)) {
        this.$emit('closeShowImg', false)
      }
    },
  }
}
</script>

<style scoped>

.wrap-image {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
}
</style>
