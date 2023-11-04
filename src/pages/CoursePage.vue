<template>
    <transition name="fade">
        <course-dialog v-if="isModalVisible" :model="course" @course-modal-closed="closeModal"></course-dialog>
    </transition>
    <loading :active='isLoading' :is-full-page="true" />

    <div class="p-2">
        <nav class="navbar navbar-light bg-light">
            <div class="container">
                <a class="navbar-brand">Courses</a>
                <div class="d-flex">
                    <button type="button" class="btn btn-primary" @click="addCourse">ADD</button>
                </div>
            </div>
        </nav>

        <hr/>
        <div class="container justify-content-center">
            <div class="p-1">
                <div class="row">
                    <div class="col-12 col-md-4 col-lg-4" v-for="course in courses" :key="course.courseId">
                        <div class="card mb-2">
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-primary fw-bold">{{ course.courseCode }}</span>
                                </div>
                                <button type="button" class="btn btn-sm btn-secondary" @click="editCourse(course)">edit</button>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col">
                                        <p class="card-text">{{ course.courseName }}</p>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="d-flex justify-content-end pt-4">
                                        <div class="form-check form-switch">
                                            <label class="form-check-label" for="statusDelSwitch">Active ?</label>
                                            <input class="form-check-input" type="checkbox" id="statusDelSwitch" @change="markCourse(course)" v-model="course.courseStatus" v-bind:true-value="1" v-bind:false-value="0" >
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
    import {ref, onMounted, toDisplayString} from 'vue'
    import Swal from 'sweetalert2'
    import Loading from 'vue-loading-overlay'
    import {useToast} from 'vue-toastification'
    import CourseDialog from '../components/CourseDialog.vue'

    import {useCourseStore} from '@/stores/CourseStore'
    const courseStore = useCourseStore()

    const toast = useToast()
    const isLoading = ref(false)
    const course = ref({})
    const courses = ref([])
    
    const isModalVisible = ref(false)

    async function loadCourses() {
        try {
            isLoading.value = true
            await courseStore.retrieveAll()
            courses.value = courseStore.getCourses
            console.log("Loading Courses")
        }
        catch (err) {
            console.log(`Error found: ${err}`)
            Swal.fire({
                icon: 'error',
                text: `${err.message}`
            })
        }
        finally {
            isLoading.value = false
        }
    }

    async function addCourse() {
        course.value = {}
        isModalVisible.value = true
    }

    async function editCourse(targetCourse) {
        course.value = targetCourse
        isModalVisible.value = true
    }

    async function markCourse(targetCourse) {
        try {
            
            isLoading.value = true
            await courseStore.mark(targetCourse)
            console.log("Marking Course Status")
            toast.success('Course status changed successfully')
        }
        catch(err) {
            console.log(`Error found: ${err}`)
            Swal.fire({
                icon: 'error',
                text: `${err.message}`
            })
        }
        finally {
            isLoading.value = false
            await loadCourses()
        }
    }

    async function closeModal() {
        isModalVisible.value = false
        loadCourses()
    }

    onMounted(async() => {
        await loadCourses()
    })
</script>