import {defineStore} from 'pinia'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

export const useSubjectStore = defineStore('subjectStore', {
    state: () => ({
        subject: {},
        subjects: []
    }),
    getters: {
        getSubject: (state) => {
            return state.subject
        },
        getSubjects: (state) => {
            return state.subjects
        },
        getActiveSubjects: (state) => {
            return state.subjects.filter(x => x.status = 1)
        },
    },
    actions: {
        retrieveAll: async function() {
            await axios.get(`${API_URL}/subjects`)
                .then(result => {
                    this.subjects = result.data
                })
                .catch(err => {
                    throw err.message
                })
        },
        retrieveByCourse: async function (courseId) {
            ;
            await axios.get(`${API_URL}/subject/course/${courseId}`)
                .then(result => {
                    this.subjects = result.data
                })
                .catch(err => {
                    throw err.message
                })
        },
        retrieveById: async function(id) {
            await axios.get(`${API_URL}/subject/id/${id}`)
                .then(result => {
                    this.subject = result.data
                })
                .catch(err => {
                    throw err.message
                })
        },
        update: async function(vm) {
            await axios.put(`${API_URL}/subject`, vm)
                .then(result => {
                    return result.data
                })
                .catch(err => {
                    throw err.message
                })
        },
        mark: async function(vm) {
            await axios.put(`${API_URL}/subject/mark`, vm)
            .then(res => {
                return res.data
            })
            .catch(err => {
                throw err
            })
        },
        insert: async function(vm) {
            
            await axios.post(`${API_URL}/subject`, vm)
            .then(res => {
                return res.data
            })
            .catch(err => {
                throw err
            })
        }
    },
})
