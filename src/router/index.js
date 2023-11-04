import { createWebHistory, createRouter, createWebHashHistory } from 'vue-router'
import CoursePage from '../pages/CoursePage.vue'
import SubjectPage from '../pages/SubjectPage.vue'
import StudentPage from '../pages/StudentPage.vue'
import TimetablePage from '../pages/TimetablePage.vue'
import LocationPage from '../pages/LocationPage.vue'
import UserPage from '../pages/UserPage.vue'
import AttendancePage from '../pages/AttendancePage.vue'
import LoginPage from '../pages/LoginPage.vue'
import { useUserStore } from '../stores/UserStore'

const routes = [
    {
        path: "/",
        redirect: '/login',
    },
    {
        path: '/login',
        name: "Login",
        component: LoginPage
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
    {
        path: '/attendance',
        name: "Attendance",
        component: AttendancePage
    },
]


const router = createRouter({
    history: createWebHistory(),
    routes: routes
})

router.beforeEach(to => {
    
    const userStore = useUserStore()
    if (to.fullPath != '/login') {
        
        if(userStore.getUser == null) {
            
            router.push('/login')
        }
    }
})


export default router