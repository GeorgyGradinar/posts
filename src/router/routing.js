import {createRouter, createWebHashHistory} from "vue-router";
import show_post from "../components/show-tasks"

export default createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            component: show_post
        },

        {
            path: '/create-edit-post/:fireBaseURL?',
            name:'create_edit_task',
            component: () => import("@/components/add-edit-task")
        },
    ]
})
