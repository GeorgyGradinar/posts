import {createStore} from "vuex";
import {collection,  onSnapshot} from 'firebase/firestore';
import {db} from '@/store/firebase-ip'

const postsCollectionRef = collection(db, 'posts');


const store = createStore({
    state() {
        return {
            articles: [],
        }
    },

    mutations: {
        getPosts() {
            onSnapshot(postsCollectionRef, (querySnapshot) => {
                const fbPosts = [];
                querySnapshot.forEach((doc) => {
                    const post = {
                        id: doc.data().id,
                        fireBaseUrl: doc.id,
                        title: doc.data().title,
                        text: doc.data().text,
                        images: doc.data().images,
                    };
                    fbPosts.push(post);
                });
                this.state.articles = fbPosts;
            });
        },
    },
    getters: {}
});

export default store;
