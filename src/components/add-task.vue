<template>
  <div class="background" id="background" @click="checkClick($event)">
    <div class="panel-glass">
      <div class="wrap-block">
        <input type="text" class="text" v-model="this.post.title">
        <textarea class="text" name="info" cols="30" maxlength="200" rows="4" v-model="this.post.text"></textarea>

        <div v-if="this.post.images.length" class="section-img">
          <div class="wrap-section-img">

            <div class="wrap-img" v-for="(image, index) in this.post.images" :key="image.id">
              <img class="img" :src="image.url" alt=""/>
              <img class="delete-img" src="../assets/close_FILL0_wght400_GRAD0_opsz48.svg"
                   @click="removeImg(index, image)"/>
            </div>

            <label class="file-upload" v-if="this.post.images.length < this.MAX_COUNT_IMAGES">
              <input type="file" multiple @change="getImages($event)"/>
              <img src="../assets/download.svg" alt="">
            </label>

          </div>
        </div>

        <drug-and-drop class="section-drug-drop" v-else @images="getImages"></drug-and-drop>
        <button class="button-submit" @click="addToFireBase">Submit</button>
      </div>
    </div>
  </div>
</template>

<script>

import drugAndDrop from "./drug-and-drop";
import {fireBaseMixins} from "@/store/firebase-requests";

const MAX_COUNT_IMAGES = 8;

export default {

  props: ['index'],

  components: {
    drugAndDrop
  },

  created() {

    if (!this.$store.state.articles[this.index]) {
      return
    }

    const post = JSON.parse(JSON.stringify(this.$store.state.articles[this.index])) || null;

    this.post = {
      title: post.title,
      text: post.text,
      id: post.id,
      fireBaseId: post.fireBaseUrl,
      images: post.images,
    }

  },

  data() {
    return {
      post: {
        title: '',
        text: '',
        id: null,
        fireBaseId: null,
        images: [],
      },
      imageLoaded: [],
      imagesUnLoaded: [],
      MAX_COUNT_IMAGES,
    }
  },

  methods: {

    // onFileChange(files) {
    //   console.log(files)
    //   this.images = files
    // },

    addToFireBase() {

      this.post.images.forEach(element => {
        if (element.name) {
          this.imageLoaded.push({name: element.name, url: element.url});
        } else {
          this.imagesUnLoaded.push(element.file);
        }
      });

      fireBaseMixins.methods.submitPosts({
        title: this.post.title,
        text: this.post.text,
        imagesUnLoaded: this.imagesUnLoaded,
        imagesURL: this.imageLoaded,
        id: this.post.id || Math.round(Math.random() * 1000),
        fireBaseUrl: this.post.fireBaseId,
      });

      this.closeAddBlock()
    },

    removeImg(index, image) {
      const COUNT_ELEMENTS = 1;
      if (image.name) {
        fireBaseMixins.methods.removeImage({imagesName: image.name, id: this.post.id});
      }
      this.post.images.splice(index, COUNT_ELEMENTS);
    },

    getImages(e) {
      let currentImages = Object.values(e.target.files).map(element => {
        let url = URL.createObjectURL(element);
        return {name: null, url, file: element};
      })
      this.post.images.push(...currentImages);
    },

    checkClick(event) {
      if (event.target.id === 'background') {
        this.closeAddBlock()
      }
    },

    closeAddBlock(){
      this.$emit('closePostBlock', false);
    },
  }
}

</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font: inherit;
  font-family: 'Poppins', sans-serif;
}

.background {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: rgb(168, 218, 220, 70%);
  overflow: hidden;
}

.wrap-block {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 600px;
  height: 600px;
  padding: 50px 50px;
  color: #fff;
}

.panel-glass {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

input,
textarea,
.section-img,
.section-drug-drop {
  margin-bottom: 10px;
}


.text {
  width: 100%;
  padding: 10px;
  resize: none;
  background: rgba(241, 250, 238, 70%);

  /*background-color: #F1FAEE;*/
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 15px;
}

.text:focus {
  outline: none;
}


.section-img {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  height: 250px;
  padding: 10px;
  border: 2px dashed #A8DADC;
}

.wrap-section-img {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  width: 100%;
  height: 230px;
}

.img {
  width: 100px;
  height: 100px;
}

.delete-img {
  display: none;
  position: absolute;
  top: 0;
}

.wrap-img:hover .delete-img {
  display: block;
}

.wrap-img {
  position: relative;
}

.file-upload {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
  border: 2px dashed #1D3557;
  /*border-radius: 3px;*/
  cursor: pointer;
}

.file-upload input[type=file] {
  display: none;
}

.section-drug-drop {
  border: 3px dashed #ccc;
}

.button-submit {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #E63946;
  transition: .2s all;
  font-size: 20px;
  cursor: pointer;
}

.button-submit:hover {
  background-color: #b92c32;
  box-shadow: 5px 5px 5px #ccc;
}

.wrap-block,
.text,
.button-submit {
  box-shadow: 3px 3px 5px #ccc;
}


</style>
