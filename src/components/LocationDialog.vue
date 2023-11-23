<template>
    <div class="overlay">
        <div class="modal-display">
            <loading :active="isLoading" :is-full-page="false"/>

            <div class="col-12 text-center bg-dark text-light">
                <h5 v-if="location.locationId == null">Add Course</h5>
                <h5 v-else>Edit Course</h5>
            </div>

            <div class="container-fluid p-3">
                <div class="row mb-3">
                    <div class="col-12">
                        <label for="code" class="form-label">Location Code:</label>
                        <input type="text" id="code" class="form-control" v-model="location.locationCode" :disabled="location.locationId > 0" :class="{'border-danger': $v.locationCode.$dirty && $v.locationCode.$invalid}">
                        <div v-if="$v.locationCode.$dirty && $v.locationCode.required.$invalid" style="color: red">This field is required</div>
                        <!-- <div v-if="$v.code.$dirty && $v.code.minLength.$invalid" style="color: red">Minimum length is 4</div> -->
                        <div v-if="$v.locationCode.$dirty && $v.locationCode.maxLength.$invalid" style="color: red">Maximum length is 6</div>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-12">
                        <label for="code" class="form-label">Location Description:</label>
                        <input type="text" id="code" class="form-control" v-model="location.locationDes" :class="{'border-danger': $v.locationDes.$dirty && $v.locationDes.$invalid}">
                        <div v-if="$v.locationDes.$dirty && $v.locationDes.required.$invalid" style="color: red">This field is required</div>
                        <!-- <div v-if="$v.code.$dirty && $v.code.minLength.$invalid" style="color: red">Minimum length is 4</div> -->
                        <div v-if="$v.locationDes.$dirty && $v.locationDes.maxLength.$invalid" style="color: red">Maximum length is 6</div>
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
    import {ref, onMounted, toRef} from 'vue'
    import Swal from 'sweetalert2'
    import Loading from 'vue-loading-overlay'
    const isLoading = ref(false)

    const props = defineProps(['model'])

    import {useToast} from 'vue-toastification'
    const toast = useToast()

    import {useVuelidate} from '@vuelidate/core'
    import {required, minLength, maxLength} from '@vuelidate/validators'
    const rules = {
        locationCode: {required, maxLength: maxLength(10), $autoDirty: true},
        locationDes: {required, maxLength: maxLength(100), $autoDirty: true}
    }
    const location = toRef(props.model)
    const $v = useVuelidate(rules, location)

    import {useLocationStore} from '../stores/LocationStore'
    const locationStore = useLocationStore()

    const emit = defineEmits(['locationModalClosed'])

    function closeDialog() {
        emit('locationModalClosed')
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
            if (location.value.locationId > 0) {
                await locationStore.update(location.value)
            }
            else {
                await locationStore.insert(location.value)
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
        console.log(`Location value: ${props.model}`)
    })
</script>