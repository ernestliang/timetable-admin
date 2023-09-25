import { createWebHistory, createRouter, createWebHashHistory } from 'vue-router'
import CoursePage from '../pages/CoursePage.vue'
import SubjectPage from '../pages/SubjectPage.vue'
import StudentPage from '../pages/StudentPage.vue'
import TimetablePage from '../pages/TimetablePage.vue'
import LocationPage from '../pages/LocationPage.vue'
import UserPage from '../pages/UserPage.vue'

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
        path: '/location',
        name: "Locations",
        component: LocationPage
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
    {
        path: '/user',
        name: "Users",
        component: UserPage
    },
]


const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
})
export default router