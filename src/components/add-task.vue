<template>
  <div class="background" id="background" @click="closeBlock($event)">
    <div class="panel-glass">
      <div class="wrap-block">
        <input type="text" class="text" v-model="title">
        <textarea class="text" name="info" cols="30" maxlength="200" rows="4" v-model="text"></textarea>

        <div v-if="images.length" class="section-img">
          <div class="wrap-section-img">
            <div class='wrap-img' v-for="(object, index) in this.images" :key="object.id">
              <img class="img" :src="object.url" alt=""/>
              <img class="delete-img" src="../assets/close_FILL0_wght400_GRAD0_opsz48.svg"
                   @click="removeImg(index)"/>
            </div>
            <label class="file-upload" v-if="this.images.length && this.imagesURL?.length < 8">
              <input type="file" multiple @change="getImages($event)"/>
              <img src="../assets/download.svg" alt="">
            </label>
          </div>
        </div>

        <drug-and-drop class="section-drug-drop" v-if="!this.images.length" @images='onFileChange'></drug-and-drop>
        <button class="button-submit" @click="getText">Submit</button>
      </div>
    </div>
  </div>
</template>

<script>

import drugAndDrop from "./drug&drop";

export default {

  props: ['titleArticle', 'textArticle', 'imagesArticle', 'id', 'fireBaseUrl', 'index'],

  components: {
    drugAndDrop
  },

  created() {
    this.title = this.mainPosts.title;
    this.text = this.mainPosts.text;
    this.images = this.mainPosts.images || {};
    this.previousID = this.mainPosts.id;
    this.fireBaseId = this.mainPosts.fireBaseUrl
    console.log(this.mainPosts)
  },


  data() {
    return {
      mainPosts: this.$store.state.articles[this.index],
      title: '',
      text: '',
      imagesURL: [],
      images: {},
      previousID: '',
      fireBaseId: null,

    }
  },


  methods: {

    onFileChange(event) {
      this.imagesURL = event
    },

    getText() {
      let chekId
      console.log(this.images)
      if (this.previousID) {
        this.$store.commit('submitTodo', {
          title: this.title,
          text: this.text,
          images: this.imagesURL,
          imagesURL:this.images,
          id: this.previousID,
          fireBaseUrl: this.fireBaseId,
        })
      } else {
        chekId = Math.round(Math.random() * 1000)
        //add to firebase
        this.$store.commit('submitTodo', {
          title: this.title,
          text: this.text,
          images: this.imagesURL,
          id: chekId,
        })
      }

      this.$emit('closePostBlock', false)
    },

    removeImg(index) {
      if (this.previousID) {
        this.$store.commit('removeImage', {images: this.images[index], id: this.previousID,})
      }
      this.images.splice(index, 1)
    },

    getImages(e) {
      let files = []
      for (let i = 0; i < e.target.files.length; i++) {
        files.push(e.target.files[i])
      }
      this.onFileChange(files)
    },

    closeBlock(event) {
      if (event.target.id === 'background')
        this.$emit('closePostBlock', false)
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
