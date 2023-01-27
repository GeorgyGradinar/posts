import {createStore} from "vuex";
import {collection,  onSnapshot} from 'firebase/firestore';
import {db} from '@/store/firebase-ip'

const todosCollectionRef = collection(db, 'posts');


const store = createStore({
    state() {
        return {
            articles: [],
        }
    },

    mutations: {

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
                    fbPosts.push(todo);
                });
                this.state.articles = fbPosts;
            });
        },
    },
    getters: {
    }
})

export default store;
