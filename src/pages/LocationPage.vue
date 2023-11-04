<template>
    <transition name="fade">
        <location-dialog v-if="isModalVisible" :model="location" @location-modal-closed="closeModal"/>
    </transition>
    <loading :active='isLoading' :is-full-page="true" />

    <div class="p-2">
        <nav class="navbar navbar-light bg-light">
            <div class="container">
                <a class="navbar-brand">Locations</a>
                <div class="d-flex">
                    <button type="button" class="btn btn-primary" @click="addLocation">ADD</button>
                </div>
            </div>
        </nav>

        <hr/>
        <div class="container justify-content-center">
            <div class="p-1">
                <div class="row">
                    <div class="col-12 col-md-4 col-lg-4" v-for="location in locations" :key="location.locationId">
                        <div class="card mb-2">
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <div>
                                    <span class="text-primary fw-bold">{{ location.locationCode }}</span>
                                </div>
                                <button type="button" class="btn btn-sm btn-secondary" @click="editLocation(location)">edit</button>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col">
                                        <p class="card-text">{{ location.locationDes }}</p>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="d-flex justify-content-end pt-4">
                                        <div class="form-check form-switch">
                                            <label class="form-check-label" for="statusDelSwitch">Active ?</label>
                                            <input class="form-check-input" type="checkbox" id="statusDelSwitch" @change="markLocation(location)" v-model="location.locationStatus" v-bind:true-value="1" v-bind:false-value="0" >
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
    import LocationDialog from '../components/LocationDialog.vue'

    import {useLocationStore} from '@/stores/LocationStore'
    const locationStore = useLocationStore()

    const toast = useToast()
    const isLoading = ref(false)
    const location = ref({})
    const locations = ref([])
    
    const isModalVisible = ref(false)

    async function loadLocations() {
        try {
            isLoading.value = true
            await locationStore.retrieveAll()
            locations.value = locationStore.getLocations
            console.log("Loading Locations")
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

    async function addLocation() {
        location.value = {}
        isModalVisible.value = true
    }

    async function editLocation(targetLocation) {
        location.value = targetLocation
        isModalVisible.value = true
    }

    async function markLocation(targetLocation) {
        try {
            
            isLoading.value = true
            await locationStore.mark(targetLocation)
            console.log("Marking Location Status")
            toast.success('Location status changed successfully')
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
            await loadLocations()
        }
    }

    async function closeModal() {
        isModalVisible.value = false
        loadLocations()
    }

    onMounted(async() => {
        await loadLocations()
    })
</script>