import {defineStore} from 'pinia'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

export const useLocationStore = defineStore('locationStore', {
    state: () => ({
        location: {},
        locations: []
    }),
    getters: {
        getLocation: (state) => {
            return state.location
        },
        getLocations: (state) => {
            return state.locations
        },
        getActiveLocations: (state) => {
            return state.locations.filter(x => x.status == 1)
        }
    },
    actions: {
        retrieveAll: async function() {
            await axios.get(`${API_URL}/locations`)
                .then(result => {
                    this.locations = result.data
                })
                .catch(err => {
                    throw err.message
                })
        },
        retrieveById: async function(id) {
            await axios.get(`${API_URL}/location/id/${id}`)
                .then(result => {
                    this.course = res.data
                })
                .catch(err => {
                    throw err.message
                })
        },
        update: async function(vm) {
            await axios.put(`${API_URL}/location`, vm)
                .then(result => {
                    return result.data
                })
                .catch(err => {
                    throw err.message
                })
        },
        mark: async function(vm) {
            await axios.put(`${API_URL}/location/mark`, vm)
            .then(res => {
                return res.data
            })
            .catch(err => {
                throw err
            })
        },
        insert: async function(vm) {
            debugger
            await axios.post(`${API_URL}/location`, vm)
            .then(result => {
                return result.data
            })
            .catch(err => {
                throw err
            })
        }
    }
})