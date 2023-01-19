import {createStore} from "vuex";
import {collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc} from 'firebase/firestore';
import {db} from '@/store/fire-base'
import {getDownloadURL, getStorage, ref, uploadBytes, deleteObject} from "firebase/storage";

const todosCollectionRef = collection(db, 'posts');
const storage = getStorage();

// const storageRef = ref(storage, name);

const store = createStore({
    state() {
        return {
            articles: [],
        }
    },

    mutations: {
        submitTodo(_, payload) {
            const prom = []
            let imagesUrl = payload.imagesURL || [];
            new Promise(resolve => {
                if (payload.images.length) {
                    payload.images.forEach(el => {
                        let file = el;
                        let name = file.name.slice(0, file.name.lastIndexOf('.'))
                        uploadBytes(ref(storage, `${payload.id}/${name}`), file).then((snapshot) => {
                            console.log('Uploaded a blob or file!' + snapshot);
                            let nameProm = new Promise(resolve => {
                                getDownloadURL(ref(storage, `${payload.id}/${name}`))
                                    .then((url) => {
                                        resolve(imagesUrl.push({url, name}))
                                    }).catch((error) => {
                                    console.log(error)
                                });
                            }).then(() => {
                                prom.push(nameProm)
                                if (prom.length === payload.images.length) {
                                    resolve(prom)
                                }
                            })
                        })
                    })
                } else {
                    resolve(prom)
                }

            }).then((res) => {
                Promise.all([res]).then(() => {
                    if (payload.fireBaseUrl) {
                        updateDoc(doc(db, 'posts', payload.fireBaseUrl), {
                            title: payload.title,
                            text: payload.text,
                            images: imagesUrl,
                            id: payload.id
                        })
                    } else {
                        addDoc(todosCollectionRef, {
                            title: payload.title,
                            text: payload.text,
                            images: imagesUrl,
                            id: payload.id
                        })
                    }

                })
            })
        },

        getPosts() {
            onSnapshot(todosCollectionRef, (querySnapshot) => {
                const fbPosts = [];
                querySnapshot.forEach((doc) => {
                    const todo = {
                        id: doc.data().id,
                        fireBaseUrl: doc.id,
                        title: doc.data().title,
                        text: doc.data().text,
                        images: doc.data().images,
                    }
                    fbPosts.push(todo)
                });
                this.state.articles = fbPosts;
                console.log(this.state.articles)
            })
        },

        updatePost(_, payload) {
            updateDoc(doc(db, 'posts', payload.fireBaseUrl), {
                title: payload.title,
                text: payload.text,
                images: payload.images,
                id: payload.id
            })
        },

        removePost(_, payload) {
            deleteDoc(doc(todosCollectionRef, `${payload.id}/${payload.images.name}`));
        },

        removeImage(_, payload) {
            // let name = file.name.slice(0, file.name.lastIndexOf('.'))
            console.log(payload.images.url)
            console.log(`${payload.id}/${payload.images.name}`)
            const desertRef = ref(storage, payload.images.url);

            deleteObject(desertRef).then(() => {
            }).catch((error) => {
                console.log(error)
            });
        }


    },
    getters: {
        // postArticle(data) {
        //     return store.articles.push(data)
        // },

        // getPosts() {
        //     console.log('ddddd')
        //     onSnapshot(todosCollectionRef, (querySnapshot) => {
        //         const fbPosts = [];
        //         querySnapshot.forEach((doc) => {
        //             const post = {
        //                 id: doc.id,
        //                 title: doc.data().title,
        //                 text: doc.data().text,
        //                 images: doc.data().images,
        //             }
        //             fbPosts.push(post)
        //         });
        //          this.articles = fbPosts;
        //     })
        //     return state.articles
        // }
    }
})

export default store;
