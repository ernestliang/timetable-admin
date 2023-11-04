import {defineStore} from 'pinia'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

export const useTimetableStore = defineStore('timetableStore', {
    state: () => ({
        timetable: []
    }),
    getters: {
        getTimetableEvents: (state) => {
            let eventArray = []
            state.timetable.map(e => {
                eventArray.push({
                    id: e.timetableId,
                    text: e.subjectName,
                    start: `2023-08-01T${e.startTime}`,
                    end: `2023-08-01T${e.endTime}`,
                    resource: String(e.classDay),
                    barColor: e.color,
                    fontColor: e.color,
                    status: e.status,
                    subjectId: e.subjectId,
                    locationId: e.locationId,
                    classroomCode: e.classroomCode
                })
            })
            return eventArray
        },
    },
    actions: {
        retrieveAll: async function() {
            await axios.get(`${API_URL}/timetables`)
                .then(res => {
                    this.timetable = res.data
                })
                .catch(err => {
                    throw err.message
                })
        },
        retrieveById: async function(id) {
            await axios.get(`${API_URL}/timetable/id/${id}`)
            .then(res => {
                this.timetable = res.data
            })
            .catch(err => {
                throw err.message
            })
        },
        retrieveByCourse: async function(courseId) {
            await axios.get(`${API_URL}/timetable/course/${courseId}`)
            .then(res => {
                this.timetable = res.data
            })
            .catch(err => {
                throw err.message
            })
        },
        update: async function(vm) {
            debugger
            await axios.put(`${API_URL}/timetable`, vm)
            .then(res => {
                return res.data
            })
            .catch(err => {
                throw err.message
            })
        },
        insert: async function(vm) {
            debugger
            await axios.post(`${API_URL}/timetable`, vm)
            .then(res => {
                return res.data
            })
            .catch(err => {
                throw err.message
            })
        },
        delete: async function(vm) {
            await axios.delete(`${API_URL}/timetable`, {data: vm})
            .then(res => {
                return res.data
            })
            .catch(err => {
                throw err.message
            })
        }
        // mark: async function(vm) {
        //     await axios.put(`${API_URL}/course/mark`, vm)
        //     .then(res => {
        //         return res.data
        //     })
        //     .catch(err => {
        //         throw err
        //     })
        // },        
    },
})
