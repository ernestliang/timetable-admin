<template>
    <loading :active='isLoading' :is-full-page="true" />
    <transition name="fade">
        <timetable-dialog v-if="isDialogVisible" :model="timetable" :subject-list="subjects" :location-list="locations" @dialog-closed="dialogClosed"></timetable-dialog>
    </transition>

    <div class="p-2">
        <nav class="navbar navbar-light bg-light">
            <div class="container">
                <a class="navbar-brand">Timetable</a>
                <div class="d-flex">
                    <select v-model="selectedCourse" class="form-select">
                        <option disabled value="-1">Please Select a course</option>
                        <option v-for="course in courses" :value="course.courseId" :key="course.courseId">{{course.courseName}}</option>
                    </select>
                </div>
            </div>
        </nav>
        <hr/>
        <div class="container">
            <DayPilotCalendar :config="calendarConfig" ref="calendar" />
        </div>
    </div>
</template>
<script setup>
    import { Daypilot, DayPilotCalendar } from '@daypilot/daypilot-lite-vue'
    import {ref, onMounted, toRef, watch} from 'vue'
    import Swal from 'sweetalert2'
    import Loading from 'vue-loading-overlay'
    import {useToast} from 'vue-toastification'
    import timetableDialog from '../components/TimetableDialog.vue'

    import {useLocationStore} from '../stores/LocationStore'
    import {useTimetableStore} from '../stores/TimetableStore'
    import {useCourseStore} from '../stores/CourseStore'
    import { useSubjectStore } from '../stores/SubjectStore'
    const locationStore = useLocationStore()
    const courseStore = useCourseStore()
    const timetableStore = useTimetableStore()
    const subjectStore = useSubjectStore()
    const selectedCourse = ref(-1)
    
    const calendar = ref(null)
    const calendarConfig = ref({
        viewType: "Resources",
        startDate: "2023-08-01",    // Dummy Data, just ignore it. It will still be date-free. Doesn't even have to be Mon. //
        
        businessBeginsHour: 7,
        businessEndsHour: 19,
        cellHeight: 23,

        timeRangeSelectedHandling : 'Disabled',
        eventResizeHandling: 'Disabled',
        eventDeleteHandling: 'Enabled',
        eventClickHandling: 'Disabled',
        // heightSpec: "BusinessHoursNoScroll",
        columns: [
            {name: 'Monday', id: '1'},
            {name: 'Tuesday', id: '2'},
            {name: 'Wednesday', id: '3'},
            {name: 'Thursday', id: '4'},
            {name: 'Friday', id: '5'},
        ],

        onTimeRangeSelected: async (args) => {
            debugger
            timetable.value = {
                timetableId: -1,
                subjectId: -1,
                subjectName: '',
                courseName: courses.value.find(x => x.courseId == selectedCourse.value).courseName,
                locationId: -1,
                classDay: args.resource,
                startTime: args.start.toLocaleString(),
                endTime: args.end.toLocaleString()
            }
            isDialogVisible.value = true;
        },
        onEventMoved: async (args) => {
            let evt = {
                subjectId: args.e.data.subjectId,
                subjectName: subjects.value.find(x => x.subjectId == args.e.data.subjectId).subjectName,
                courseName: courses.value.find(x => x.courseId == selectedCourse.value).courseName,
                newStartTime: args.newStart.value.split('T')[1],
                newEndTime: args.newEnd.value.split('T')[1],
                newDay: parseInt(args.newResource),
                timetableId: args.e.data.id
            }
            
            await postCreateUpdateEvent(evt)
        },
        onEventDeleted: async (args) => {
            
            let evt = {
                subjectId: args.e.data.subjectId,
                subjectName: args.e.data.text,
                courseName: courses.value.find(x => x.courseId == selectedCourse.value).courseName,
                newDay: parseInt(args.e.data.resource),
                timetableId: args.e.data.id
            }
            await postDeleteEvent(evt)
        },
        onBeforeEventRender: args => {
            args.data.areas = []
            args.data.areas.push({ 
                html: `<span class='text-dark fw-bold'>${args.data.classroomCode}</span>`,
                right: 2,
                bottom: 2
            })

            if(args.data.status == 0) {
                args.data.backColor = "#ffc0c0";
                args.data.areas.push({ html: '<h6 class="text-danger">* Cancelled *</h6>', left: 1, bottom: 1})
            }
        },
    })

    const toast = useToast()
    const isLoading = ref(false)
    const courses = ref([])
    const subjects = ref([])
    const timetable = ref({})
    const timetableEvents = ref([])
    const isDialogVisible = ref(false)
    const locations = ref([])

    async function loadCourses() {
        try {
            isLoading.value = true;
            await courseStore.retrieveAll()
            courses.value = courseStore.getCourses
        } 
        catch(err) {
            console.log(`Error found when loading courses: ${err}`)
            Swal.fire({
                icon: 'error',
                text: `${err}`
            })
        }
        finally {
            isLoading.value = false;
        }
    }
    async function loadLocations() {
        try {
            isLoading.value = true;
            await locationStore.retrieveAll()
            locations.value = locationStore.getLocations
        } 
        catch(err) {
            console.log(`Error found when loading courses: ${err}`)
            Swal.fire({
                icon: 'error',
                text: `${err}`
            })
        }
        finally {
            isLoading.value = false;
        }
    }
    async function loadSubjects(courseId) {
        try {
            isLoading.value = true
            await subjectStore.retrieveByCourse(courseId)
            // subjects.value = []
            subjects.value = subjectStore.getActiveSubjects
        }
        catch(err) {
            Swal.fire({icon: 'error', text: err.message})
        }
        finally {
            isLoading.value = false
        }
    }
    async function loadTimetableEvents(courseId) {
        try {
            isLoading.value = true
            await timetableStore.retrieveByCourse(courseId)
            // timetableEvents.value = timetableStore.getTimetableEvents

            let events = timetableStore.getTimetableEvents
            calendar.value.control.update({events})
        }
        catch (err) {
            console.log(`Error found when loading timetable: ${err}`)
            Swal.fire({
                icon: 'error',
                text: `${err}`
            })
        }
        finally {
            isLoading.value = false
        }
    }
    async function postCreateUpdateEvent(model) {
        try {
            isLoading.value = true

            if(model.timetableId <= 0) {
                await timetableStore.insert(model)
            }
            else await timetableStore.update(model)

            toast.success("Data update successfuly")

            await loadTimetableEvents(selectedCourse.value)
        }
        catch(err) {
            Swal.fire({ icon: 'error', text: err.message })
        }
        finally {
            isLoading.value = false
        }
    }
    async function postDeleteEvent(model) {
        try {
            isLoading.value = true
            await timetableStore.delete(model)
            toast.success("Subject deleted successfuly")

            await loadTimetableEvents(selectedCourse.value)
            
        }
        catch(err) {
            Swal.fire({ icon: 'error', text: err.message })
        }
        finally {
            isLoading.value = false
        }
    }

    async function dialogClosed(model) {
        isDialogVisible.value = false;

        if(model) {
            await postCreateUpdateEvent(model)
        }

        calendar.value.control.clearSelection()
    }

    watch(selectedCourse, async (newVal, oldVal) => {
        calendar.value.control.timeRangeSelectedHandling = 'Enabled'

        
        await loadTimetableEvents(newVal)
        await loadSubjects(newVal)
    })

    onMounted(async() => {
        await loadCourses()
        await loadLocations()
    })
</script>
<style scoped>

</style>