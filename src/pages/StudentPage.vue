<template>

<loading :active='isLoading' :is-full-page="true" />

    <div class="p-2">
        <nav class="navbar navbar-light bg-light">
            <div class="container">
                <a class="navbar-brand">Students</a>
            </div>
        </nav>
    </div>

    <div class="container justify-content-center">
        <table class="table table-striped table-responsive w-75">
            <thead>
                <tr> 
                    <th scope="col" class="text-center">
                    </th>
                    <th scope="col">
                        Email
                    </th>
                    <th scope="col">
                        Token
                    </th>
                </tr>
            </thead>
            <tbody v-for="(student, index) in studentStore.getStudents" :key="student.id">
                <tr>
                    <td scope="col">
                        {{ index + 1 }}
                    </td>
                    <td scope="col" class="text-primary fw-bold">
                        {{ student.email }}
                    </td>
                    <td scope="col" style="width:250px;" class="text-wrap">
                        {{ student.token }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

</template>

<script setup>
    import {ref, onMounted} from 'vue'
    import Swal from 'sweetalert2'
    import Loading from 'vue-loading-overlay'

    import {useStudentStore} from '@/stores/StudentStore'

    const isLoading = ref(false)
    const students = ref([])
    const studentStore = useStudentStore()

    async function loadStudents() {
        try {
            isLoading.value = true
            await studentStore.retrieveAll()
            students.value = studentStore.getStudents
            console.log("Loading Students")
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

    onMounted(async() => {
        await loadStudents()
    })


</script>