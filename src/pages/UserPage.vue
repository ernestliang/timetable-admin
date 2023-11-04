<template>
    <transition name="fade">
        <location-dialog v-if="isModalVisible" :model="user" :users="users" @user-modal-closed="closeModal"/>
    </transition>
    <loading :active='isLoading' :is-full-page="true" />

    <div class="p-2">
        <nav class="navbar navbar-light bg-light">
            <div class="container">
                <a class="navbar-brand">Users</a>
                <div class="d-flex">
                    <button type="button" class="btn btn-primary" @click="addUser">ADD</button>
                </div>
            </div>
        </nav>

        <hr/>
        <div class="container justify-content-center">
            <div class="p-1">
                <div class="row">
                    <div class="col-12 col-md-4 col-lg-4" v-for="user in users" :key="user.userId">
                        <div class="card mb-2">
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-primary fw-bold">{{ user.userName }}</span>
                                </div>
                                <button type="button" class="btn btn-sm btn-secondary" @click="editUser(user)">edit</button>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col">
                                        <p class="card-text">{{ user.userEmail }}</p>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="d-flex justify-content-end pt-4">
                                        <div class="form-check form-switch">
                                            <label class="form-check-label" for="statusDelSwitch">Active ?</label>
                                            <input class="form-check-input" type="checkbox" id="statusDelSwitch" @change="markUser(user)" v-model="user.userStatus" v-bind:true-value="1" v-bind:false-value="0" >
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
    import LocationDialog from '../components/UserDialog.vue'

    import {useUserStore} from '@/stores/UserStore'
    const userStore = useUserStore()

    const toast = useToast()
    const isLoading = ref(false)
    const user = ref({})
    const users = ref([])
    
    const isModalVisible = ref(false)

    async function loadUsers() {
        try {
            isLoading.value = true
            await userStore.retrieveAll()
            users.value = userStore.getUsers
            console.log("Loading Users")
        }
        catch (err) {
            console.log(`Error found when loading users: ${err}`)
            Swal.fire({
                icon: 'error',
                text: `${err.message}`
            })
        }
        finally {
            isLoading.value = false
        }
    }

    async function addUser() {
        user.value = {}
        isModalVisible.value = true
    }

    async function editUser(targetUser) {
        user.value = targetUser
        isModalVisible.value = true
    }

    async function markUser(targetUser) {
        try {
            
            isLoading.value = true
            await userStore.mark(targetUser)
            console.log("Marking User Status")
            toast.success('User status changed successfully')
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
            await loadUsers()
        }
    }

    async function closeModal() {
        isModalVisible.value = false
        loadUsers()
    }

    onMounted(async() => {
        await loadUsers()
    })
</script>