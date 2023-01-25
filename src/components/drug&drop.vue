<template>
  <form ref="fileform">
    <span class="drop-files">Drop the files here!</span>
    <label class="file-upload">
      <input type="file" multiple @change="images($event)"/>
      <svg class="img-download" xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path fill="" d="M11 40q-1.2 0-2.1-.9Q8 38.2 8 37v-7.15h3V37h26v-7.15h3V37q0 1.2-.9 2.1-.9.9-2.1.9Zm13-7.65-9.65-9.65 2.15-2.15 6 6V8h3v18.55l6-6 2.15 2.15Z"/></svg>
    </label>
  </form>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "drug&drop",

  mounted() {
    this.dragAndDropCapable = this.determineDragAndDropCapable();
    if (this.dragAndDropCapable) {
      ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(function (evt) {
        this.$refs.fileform.addEventListener(evt, function (e) {
          e.preventDefault();
          e.stopPropagation();
        }.bind(this), false);
      }.bind(this));
      this.$refs.fileform.addEventListener('drop', function (e) {
        console.log(e)
        for (let i = 0; i < e.dataTransfer.files.length; i++) {
          this.files.push(e.dataTransfer.files[i]);
        }
        this.getImagePreviews();
      }.bind(this));
    }
  },

  data() {
    return {
      dragAndDropCapable: false,
      files: []
    }
  },

  methods: {

    determineDragAndDropCapable() {
      let div = document.createElement('div');
      return (('draggable' in div)
              || ('ondragstart' in div && 'ondrop' in div))
          && 'FormData' in window
          && 'FileReader' in window;
    },

    getImagePreviews() {
      this.$emit('images', this.files)
    },

    images(event) {
      this.$emit('images', event)
    }
  }
}
</script>

<style scoped>

form {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 250px;
}

.drop-files {
  margin-bottom: 10px;
}

.file-upload {
  display: block;
  width: 50px;
  height: 50px;
  overflow: hidden;
  cursor: pointer;
}

.file-upload input[type=file] {
  display: none;
}

.img-download{
  transition: .2s all;
}

.img-download:hover{
  fill: #b92c32;
}

</style>
