<template>
    <div class="overlay">
        <div class="modal-display">
            <loading :active='isLoading' :is-full-page='false' />

            <div class="col-12 text-center bg-dark text-light">
                <h5 v-if="course.courseId == null">Add Course</h5>
                <h5 v-else>Edit Course</h5>
            </div>

            <div class="container-fluid p-3">
                <div class="row mb-3">
                    <div class="col-12">
                        <label for="code" class="form-label">Course Code:</label>
                        <input type="text" id="code" class="form-control" v-model="course.courseCode" :disabled="course.courseId > 0" :class="{ 'border-danger': $v.courseCode.$dirty && $v.courseCode.$invalid }">
                        <div v-if="$v.courseCode.$dirty && $v.courseCode.required.$invalid" style="color: red">This field is required</div>
                        <!-- <div v-if="$v.code.$dirty && $v.code.minLength.$invalid" style="color: red">Minimum length is 4</div> -->
                        <div v-if="$v.courseCode.$dirty && $v.courseCode.maxLength.$invalid" style="color: red">Maximum length is 6</div>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-12">
                        <label for="name" class="form-label">Name:</label>
                        <input type="text" id="name" class="form-control" v-model="course.courseName" :class="{ 'border-danger': $v.courseName.$dirty && $v.courseName.$invalid }">
                        <div v-if="$v.courseName.$dirty && $v.courseName.required.$invalid" style="color: red">This field is required</div>
                        <!-- <div v-if="$v.courseName.$dirty && $v.courseName.minLength.$invalid" style="color: red">Minimum length is 10</div> -->
                        <div v-if="$v.courseName.$dirty && $v.courseName.maxLength.$invalid" style="color: red">Maximum length is 40</div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="d-flex justify-content-end">
                    <button type="button" class="btn btn-secondary" @click="closeDialog">Close</button>
                    &nbsp;&nbsp;
                    <button type="button" class="btn btn-primary" @click="saveDialog">Save</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
    import {ref, onMounted, toRef, defineEmits} from 'vue'
    import { useVuelidate } from '@vuelidate/core'
    import { required, email, minLength, maxLength } from '@vuelidate/validators'
    import {useCourseStore} from '../stores/CourseStore'
    import Swal from 'sweetalert2'
    import Loading from 'vue-loading-overlay'

    import {useToast} from 'vue-toastification'
    const toast = useToast()

    const courseStore = useCourseStore()

    const emit = defineEmits(['courseModalClosed'])
    const props = defineProps(['model'])

    const course = toRef(props.model)
    // const course = ref(props.model)

    const rules = {
        courseCode: { required, maxLength: maxLength(5), $autoDirty: true },
        courseName: { required, maxLength: maxLength(100), $autoDirty: true },
             
    }
    const $v = useVuelidate(rules, course)

    const isLoading = ref(false)

    function closeDialog () {
        emit('courseModalClosed')
    }
    async function saveDialog () {
        const isFormCorrect = await $v.value.$validate()
        if (!isFormCorrect) {
            Swal.fire({
                icon: 'error',
                text: 'Invalid form data'
            })
            return
        }

        isLoading.value = true
        try {
            if (course.value.courseId > 0) {
                await courseStore.update(course.value)
            }
            else {
                await courseStore.insert(course.value)
            }
            toast.success('Data Updated Successfully')
            closeDialog()
        }
        catch (err) {
            Swal.fire({
                icon: 'error',
                text: `${err.message}`
            })
        }
        finally {
            isLoading.value = false
        }
    }

    onMounted ( async () => {
        console.log(`Course value: ${props.model}`)
    })

</script>