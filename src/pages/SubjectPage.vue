<template>
    <loading :active='isLoading' :is-full-page="true" />
    <transition name="fade">
        <subject-dialog v-if="isModalVisible" :model="subject" :courses="courses" @subject-modal-closed="closeModal"></subject-dialog>
    </transition>

    <div class="p-2">
        <nav class="navbar navbar-light bg-light">
            <div class="container">
                <a class="navbar-brand">Subjects</a>
                <div class="d-flex">
                    <select class="form-select" id="courseid" v-model="selectedCourse">
                        <option value="-1" selected disabled>Please select a course</option>
                        <option v-for="course in courses" :value="course.courseId">
                            {{ course.courseName }}
                        </option>
                    </select>
                    <button type="button" class="btn btn-primary" @click="addSubject">ADD</button>
                </div>
            </div>
        </nav>
        <hr/>
        <div class="container justify-content-center">
            <table class="table">
                <thead>
                    <tr> 
                        <th scope="col" class="text-center">
                        </th>
                        <th scope="col">
                            Code
                        </th>
                        <th scope="col">
                            Subject
                        </th>
                        <th scope="col" class="d-none d-md-table-cell">
                            Course
                        </th>
                        <th scope="col">
                        </th>
                    </tr>
                </thead>
                <tbody v-for="(sub, index) in subjects" :key="subject.id">
                    <tr>
                        <td scope="col">
                            {{ index + 1 }}
                        </td>
                        <td scope="col" class="text-primary fw-bold">
                            {{ sub.subjectCode }}
                        </td>
                        <td scope="col">
                            {{ sub.subjectName }}
                        </td>
                        <td scope="col" class="d-none d-md-table-cell">
                            {{ sub.courseName }}
                        </td>
                        <td>
                            <div class="form-check form-switch">
                                <label class="form-check-label" for="statusDelSwitch">Active ?</label>
                                <input class="form-check-input" type="checkbox" id="statusDelSwitch" @change="markSubject(sub)" v-model="sub.status" v-bind:true-value="1" v-bind:false-value="0" >
                            </div>
                        </td>
                        <td>
                            <button type="button" class="btn btn-sm btn-secondary" @click="editSubject(sub)">edit</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
<script setup>
    import {ref, onMounted, toRef, watch} from 'vue'
    import Swal from 'sweetalert2'
    import Loading from 'vue-loading-overlay'
    import SubjectDialog from '../components/SubjectDialog.vue'
    import {useToast} from 'vue-toastification'

    import {useSubjectStore} from '../stores/SubjectStore'
    import {useCourseStore} from '../stores/CourseStore'
    const subjectStore = useSubjectStore()
    const courseStore = useCourseStore()
    const selectedCourse = ref(-1)

    const toast = useToast()
    const isLoading = ref(false)
    const subject = ref({})
    const subjects = ref([])
    const courses = ref([])
    const isModalVisible = ref(false)

    async function loadSubjects() {
        try {
            isLoading.value = true;
            await subjectStore.retrieveByCourse(selectedCourse.value)
            subjects.value = subjectStore.getSubjects
        }
        catch(err) {
            console.log(`Error found when loading subjects: ${err}`)
            Swal.fire({
                icon: 'error',
                text: `${err}`
            })
        }
        finally {
            isLoading.value = false
        }
    }
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

    async function addSubject() {
        subject.value = {courseId: -1}
        isModalVisible.value = true
    }
    async function editSubject(targetSubject) {
        subject.value = targetSubject
        isModalVisible.value = true
    }
    async function markSubject(targetSubject) {
        try {
            
            isLoading.value = true
            await subjectStore.mark(targetSubject)
            toast.success('Subject status changed successfully')
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
            await loadSubjects()
        }
    }

    async function closeModal() {
        isModalVisible.value = false
        loadSubjects()
    }

    watch(selectedCourse, async (newVal, oldVal) => {
        
        await loadSubjects(newVal)
    })
    onMounted(async() => {
        await loadCourses()
        // await loadSubjects()
    })

</script>
<style scoped>

</style>