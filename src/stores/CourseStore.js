import {defineStore} from 'pinia'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

export const useCourseStore = defineStore('courseStore', {
    state: () => ({
        course: {},
        courses: []
    }),
    getters: {
        getCourse: (state) => {
            return state.course
        },
        getCourses: (state) => {
            return state.courses
        },
        getActiveCourses: (state) => {
            return state.courses.filter(x => x.status == 1)
        }
    },
    actions: {
        retrieveAll: async function() {
            await axios.get(`${API_URL}/courses`)
                .then(res => {
                    this.courses = res.data
                })
                .catch(err => {
                    throw err.message
                })
        },
        retrieveById: async function(id) {
            await axios.get(`${API_URL}/course/id/${id}`)
            .then(res => {
                this.course = res.data
            })
            .catch(err => {
                throw err.message
            })
        },
        update: async function(vm) {
            await axios.put(`${API_URL}/course`, vm)
            .then(res => {
                return res.data
            })
            .catch(err => {
                throw err.message
            })
        },
        mark: async function(vm) {
            await axios.put(`${API_URL}/course/mark`, vm)
            .then(res => {
                return res.data
            })
            .catch(err => {
                throw err
            })
        },
        insert: async function(vm) {
            await axios.post(`${API_URL}/course`, vm)
            .then(res => {
                return res.data
            })
            .catch(err => {
                throw err
            })
        }
    },
})
