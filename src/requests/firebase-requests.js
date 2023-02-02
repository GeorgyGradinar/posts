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
            promises = [];
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
                        this.appendToFireBase(false, payload);
                    } else {
                        this.appendToFireBase(true, payload);
                    }
                });
            });
        },


        appendToFireBase(isNewPost, payload) {
            const templatePost = {
                title: payload.title,
                text: payload.text,
                images: imagesUrl,
                id: payload.id
            };
            isNewPost ? addDoc(POST_COLLECTION_REF, templatePost) : updateDoc(doc(POST_COLLECTION_REF, payload.fireBaseUrl), templatePost);
        },

        upLoadImages(payload, resolveMainPromise) {
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

        getImageUrl(payload, resolveGetUrlImage, name) {
            getDownloadURL(ref(STORAGE, `${payload.id}/${name}`))
                .then((url) => {
                    resolveGetUrlImage(imagesUrl.push({url, name}));
                }).catch((error) => {
                console.log(error);
            });
        },

        removePost(payload) {
            deleteDoc(doc(POST_COLLECTION_REF, payload.firebase));

            payload.images.forEach(image => {
                this.removeImage({imagesName: image.name, id: payload.id});
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
