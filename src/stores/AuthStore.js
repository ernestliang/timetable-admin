import {defineStore} from 'pinia'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

export const useAuthStore = defineStore('authStore', {
    state: () => ({
        user: {}
    }),
    getters: {
        getUser: (state) => {
            return state.user
        },
    },
    actions: {
        retrieveAll: async function() {
            await axios.get(`${API_URL}/users`)
                .then(res => {
                    this.courses = res.data
                })
                .catch(err => {
                    throw err.message
                })
        },
        retrieveById: async function(id) {
            await axios.get(`${API_URL}/user/id/${id}`)
            .then(res => {
                this.course = res.data
            })
            .catch(err => {
                throw err.message
            })
        },
        update: async function(vm) {
            
            await axios.put(`${API_URL}/user`, vm)
            .then(res => {
                return res.data
            })
            .catch(err => {
                throw err.message
            })
        },
        mark: async function(vm) {
            await axios.put(`${API_URL}/user/mark`, vm)
            .then(res => {
                return res.data
            })
            .catch(err => {
                throw err
            })
        },
        insert: async function(vm) {
            
            await axios.post(`${API_URL}/user`, vm)
            .then(res => {
                return res.data
            })
            .catch(err => {
                throw err
            })
        },
        authenticate: async function(vm) {
            await axios.post(`${API_URL}/user/authenticate`, vm)
            .then(res => {
                state.user = res.data
            })
            .catch(err => {
                throw err
            })
        }
    },
})
