import {deleteObject, getDownloadURL, getStorage, ref, uploadBytes} from "firebase/storage";
import {addDoc, collection, deleteDoc, doc, updateDoc} from "firebase/firestore";
import {db} from "@/store/fire-base";

const todosCollectionRef = collection(db, 'posts');
const storage = getStorage();

const myMixin = {
    created: function () {
        this.submitPosts()
        this.removePost()
        this.removeImage()
    },

    methods: {

        submitPosts(payload) {
            const prom = []
            let imagesUrl = payload.imagesURL || [];
            new Promise(resolve => {
                if (payload.imagesUnLoaded.length) {
                    payload.imagesUnLoaded.forEach(el => {
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
                                if (prom.length === payload.imagesUnLoaded.length) {
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

        removePost(payload) {
            deleteDoc(doc(todosCollectionRef, payload.firebase));
            payload.images.forEach(el => {
                this.removeImage({imagesName: el.name, id: payload.id})
            })
        },

        removeImage(payload) {
            deleteObject(ref(storage, `${payload.id}/${payload.imagesName}`)).then(() => {
            }).catch((error) => {
                console.log(error)
            });
        }
    }
}

export {
    myMixin
}
