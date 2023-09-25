import {defineStore} from 'pinia'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

export const useUserStore = defineStore('userStore', {
    state: () => ({
        user: {},
        users: []
    }),
    getters: {
        getUser: (state) => {
            return state.user
        },
        getUsers: (state) => {
            return state.users
        },
        getActiveUsers: (state) => {
            return state.users.filter(x => x.status == 1)
        }
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
            debugger
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
            debugger
            await axios.post(`${API_URL}/user`, vm)
            .then(res => {
                return res.data
            })
            .catch(err => {
                throw err
            })
        }
    },
})
