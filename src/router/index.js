import { createWebHistory, createRouter, createWebHashHistory } from 'vue-router'
import CoursePage from '../pages/CoursePage.vue'
import SubjectPage from '../pages/SubjectPage.vue'
import StudentPage from '../pages/StudentPage.vue'
import TimetablePage from '../pages/TimetablePage.vue'

const routes = [
    {
        path: "/",
        redirect: '/course',
    },
    {
        path: '/course',
        name: "Courses",
        component: CoursePage
    },
    {
        path: '/subject',
        name: "Subjects",
        component: SubjectPage
    },
    {
        path: '/student',
        name: "Students",
        component: StudentPage
    },
    {
        path: '/timetable',
        name: "Timetables",
        component: TimetablePage
    },
]


const router = createRouter({
    history: createWebHistory(),
    routes: routes
})
export default router