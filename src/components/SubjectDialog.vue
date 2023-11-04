<template>
    <div class="overlay">
        <div class="modal-display">
            <loading :active='isLoading' :is-full-page="false" />

            <div class="col-12 text-center bg-dark text-light">
                <h5 v-if="subject.subjectId == null">Add</h5>
                <h5 v-else>Edit</h5>
            </div>

            <div class="container-fluid p-3">
                <!-- Code & Type -->
                <div class="row">
                    <div class="col-12 col-md-8 col-lg-8">
                        <div class="row mb-3">
                            <div class="col-12">
                                <label for="code" class="form-label">Subject Code:</label>
                                <input type="text" id="code" class="form-control" v-model="subject.subjectCode" :disabled="subject.subjectId > 0" :class="{ 'border-danger': $v.subjectCode.$dirty && $v.subjectCode.$invalid }">
                                <div v-if="$v.subjectCode.$dirty && $v.subjectCode.required.$invalid" style="color: red">This field is required</div>
                                <!-- <div v-if="$v.subjectCode.$dirty && $v.subjectCode.minLength.$invalid" style="color: red">Minimum length is 4</div> -->
                                <div v-if="$v.subjectCode.$dirty && $v.subjectCode.maxLength.$invalid" style="color: red">Maximum length is 6</div>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-12">
                                <label for="name" class="form-label">Name:</label>
                                <input type="text" id="name" class="form-control" v-model="subject.subjectName" :class="{ 'border-danger': $v.subjectName.$dirty && $v.subjectName.$invalid }">
                                <div v-if="$v.subjectName.$dirty && $v.subjectName.required.$invalid" style="color: red">This field is required</div>
                                <!-- <div v-if="$v.subjectName.$dirty && $v.subjectName.minLength.$invalid" style="color: red">Minimum length is 10</div> -->
                                <div v-if="$v.subjectName.$dirty && $v.subjectName.maxLength.$invalid" style="color: red">Maximum length is 40</div>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-12">
                                <label class="form-label" for="courseid">Course</label>
                                <select class="form-select" id="courseid" v-model="subject.courseId" :class="{ 'border-danger': $v.courseId.$dirty && $v.courseId.$invalid }">
                                    <option v-if="subject.courseId <= 0" value="-1" selected>Please select a course</option>
                                    <option v-for="course in courses" :value="course.courseId" :key="course.courseId">
                                        {{ course.courseName }}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-md-4 col-lg-4">
                        <div class="row mb-3">
                            <div class="col-12">
                                <label class="form-label" for="courseid">Label Color</label>
                                <color-picker id="colorpicker" v-model:pureColor ="subject.color" format="hex" :disable-history="true" :disable-alpha="true" use-type="pure" :is-widget="true"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="d-flex justify-content-end">
                    <button type="button" class="btn btn-secondary" @click="closeDialog()">Close</button>
                    &nbsp;&nbsp;
                    <button type="button" class="btn btn-primary" @click="saveDialog()">Save</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>

    import {ref, onMounted, toRef} from 'vue'
    import Swal from 'sweetalert2'
    import Loading from 'vue-loading-overlay'
    const isLoading = ref(false)

    import {useToast} from 'vue-toastification'
    const toast = useToast()

    import {useVuelidate} from '@vuelidate/core'
    import {required, minValue, maxLength} from '@vuelidate/validators'
    const rules = {
        subjectCode: {required, maxLength: maxLength(10), $autoDirty: true},
        subjectName: {required, maxLength: maxLength(100), $autoDirty: true},
        courseId: {required, minValue: minValue(1), $autoDirty: true}
    }
    const subject = toRef(props.model)
    const $v = useVuelidate(rules, subject)

    import {useSubjectStore} from '../stores/SubjectStore'
    const subjectStore = useSubjectStore()

    const emit = defineEmits(['subjectModalClosed'])
    const props = defineProps(['model', 'courses'])

    function closeDialog() {
        emit('subjectModalClosed')
    }
    async function saveDialog() {
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
            if (subject.value.subjectId > 0) {
                await subjectStore.update(subject.value)
            }
            else {
                await subjectStore.insert(subject.value)
            }
            toast.success('Data Updated Successfully')
            closeDialog()
        }
        catch(err) {
            Swal.fire({
                icon: 'error',
                text: `${err.message}`
            })
        }
        finally {
            isLoading.value = false
        }
    }

    onMounted(async() => {
        console.log(`Subject value: ${JSON.stringify(props.model)}`)
    })

</script>