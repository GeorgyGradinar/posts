import {deleteObject, getDownloadURL, getStorage, ref, uploadBytes} from "firebase/storage";
import {addDoc, collection, deleteDoc, doc, updateDoc} from "firebase/firestore";
import {db} from "@/store/firebase-ip";

const POST_COLLECTION_REF = collection(db, 'posts');
const STORAGE = getStorage();

let promises;
let imagesUrl;

const fireBaseMixins = {

    methods: {

        submitPosts(payload) {
            promises = []
            imagesUrl = payload.imagesURL || [];
            new Promise(resolveMainPromise => {
                if (payload.imagesUnLoaded.length) {
                    this.upLoadImages(payload, resolveMainPromise);
                } else {
                    resolveMainPromise(promises);
                }
            }).then((result) => {
                Promise.all([result]).then(() => {
                    if (payload.fireBaseUrl) {
                        this.updatePost(payload);
                    } else {
                        this.addNewPost(payload);
                    }
                })
            })
        },

        updatePost(payload){
            updateDoc(doc(POST_COLLECTION_REF, payload.fireBaseUrl), {
                title: payload.title,
                text: payload.text,
                images: imagesUrl,
                id: payload.id
            });
        },

        addNewPost(payload){
            addDoc(POST_COLLECTION_REF, {
                title: payload.title,
                text: payload.text,
                images: imagesUrl,
                id: payload.id
            });
        },

        upLoadImages(payload, resolveMainPromise){
            payload.imagesUnLoaded.forEach(element => {
                let name = element.name.slice(0, element.name.lastIndexOf('.'));
                uploadBytes(ref(STORAGE, `${payload.id}/${name}`), element).then((snapshot) => {
                    console.log('Uploaded a blob or file!' + snapshot);
                    let nameProm = new Promise(resolveGetUrlImage => {
                        this.getImageUrl(payload, resolveGetUrlImage, name);
                    }).then(() => {
                        promises.push(nameProm);
                        if (promises.length === payload.imagesUnLoaded.length) {
                            resolveMainPromise(promises);
                        }
                    });
                });
            });
        },

        getImageUrl(payload, resolveGetUrlImage, name){
            getDownloadURL(ref(STORAGE, `${payload.id}/${name}`))
                .then((url) => {
                    resolveGetUrlImage(imagesUrl.push({url, name}));
                }).catch((error) => {
                console.log(error);
            });
        },

        removePost(payload) {
            deleteDoc(doc(POST_COLLECTION_REF, payload.firebase));
            payload.images.forEach(element => {
                this.removeImage({imagesName: element.name, id: payload.id});
            });
        },

        removeImage(payload) {
            deleteObject(ref(STORAGE, `${payload.id}/${payload.imagesName}`)).then(() => {
            }).catch((error) => {
                console.log(error);
            });
        }
    }
}

export {
    fireBaseMixins
};
