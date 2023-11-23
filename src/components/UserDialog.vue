<template>
    <div class="overlay">
        <div class="modal-display">
            <loading :active='isLoading' :is-full-page="false" />

            <div class="col-12 text-center bg-dark text-light">
                <h5 v-if="user.userId == null">Add</h5>
                <h5 v-else>Edit</h5>
            </div>

            <div class="container-fluid p-3">
                <!-- Code & Type -->
                <div class="row">
                    <div class="col-12 col-md-8 col-lg-8">
                        <div class="row mb-3">
                            <div class="col-12">
                                <label for="name" class="form-label">User Name:</label>
                                <input type="text" id="name" class="form-control" v-model="user.userName" :class="{ 'border-danger': $v.userName.$dirty && $v.userName.$invalid }">
                                <div v-if="$v.userName.$dirty && $v.userName.required.$invalid" style="color: red">This field is required!</div>
                                <!-- <div v-if="$v.userName.$dirty && $v.userName.minLength.$invalid" style="color: red">Minimum length is 10</div> -->
                                <div v-if="$v.userName.$dirty && $v.userName.maxLength.$invalid" style="color: red">Maximum length is 50!</div>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-12">
                                <label for="code" class="form-label">Email:</label>
                                <input type="text" id="code" class="form-control" v-model="user.userEmail" :class="{ 'border-danger': $v.userEmail.$dirty && $v.userEmail.$invalid }">
                                <div v-if="$v.userEmail.$dirty && $v.userEmail.required.$invalid" style="color: red">This field is required!</div>
                                <!-- <div v-if="$v..$dirty && $v..minLength.$invalid" style="color: red">Minimum length is 4</div> -->
                                <div v-if="$v.userEmail.$dirty && $v.userEmail.maxLength.$invalid" style="color: red">Maximum email length is 100 characters!</div>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-12">
                                <label for="code" class="form-label">Password:</label>
                                <input type="text" id="code" class="form-control" v-model="user.userPassword" :class="{ 'border-danger': $v.userPassword.$dirty && $v.userPassword.$invalid }">
                                <div v-if="$v.userPassword.$dirty && $v.userPassword.required.$invalid" style="color: red">This field is required.</div>
                                <div v-if="$v.userPassword.$dirty && $v.userPassword.minLength.$invalid" style="color: red">Minimum password length is 5 characters!</div>
                                <div v-if="$v.userPassword.$dirty && $v.userPassword.maxLength.$invalid" style="color: red">Maximum password length is 64 characters!</div>
                            </div>
                        </div>
                    </div>
                    <!-- Color portion; Just ignore -->
                    <!-- <div class="col-12 col-md-4 col-lg-4">
                        <div class="row mb-3">
                            <div class="col-12">
                                <label class="form-label" for="courseid">Label Color</label>
                                <color-picker id="colorpicker" v-model:pureColor ="subject.color" format="hex" :disable-history="true" :disable-alpha="true" use-type="pure" :is-widget="true"/>
                            </div>
                        </div>
                    </div> -->
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
    const props = defineProps(['model', 'users'])

    import {useToast} from 'vue-toastification'
    const toast = useToast()

    import {useVuelidate} from '@vuelidate/core'
    import {required, minLength, minValue, maxLength} from '@vuelidate/validators'
    const rules = {
        userName: {required, maxLength: maxLength(50), $autoDirty: true},
        userEmail: {required, maxLength: maxLength(100), $autoDirty: true},
        userPassword: {required, minLength: minLength(5), maxLength: maxLength(64), $autoDirty: true}
    }
    const user = toRef(props.model)
    const $v = useVuelidate(rules, user)

    import {useUserStore} from '../stores/UserStore'
    const userStore = useUserStore()

    const emit = defineEmits(['usersubjectModalClosed'])
    const users = toRef(props.users)

    function closeDialog() {
        emit('userModalClosed')
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
            if (user.value.userId > 0) {
                await userStore.update(user.value)
            }
            else {
                await userStore.insert(user.value)
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
        console.log(`User value: ${JSON.stringify(props.model)}`)
    })

</script>