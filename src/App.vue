<template>
    <div class="p-3">
        <nav class="navbar navbar-expand-lg navbar-light bg-dark">
            <div class="container-fluid">
                <a class="navbar-brand text-primary" href="#">Scheduler</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
        
                <div v-if="userStore.getUser" class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <button class="nav-link active" id="pills-accounts-tab" data-bs-toggle="pill" type="button" role="tab" aria-controls="pills-home" aria-selected="true">
                                <router-link to="/course">Courses</router-link>
                            </button>
                        </li>
                        <li class="nav-item">
                            <button class="nav-link active" id="pills-accounts-tab" data-bs-toggle="pill" type="button" role="tab" aria-controls="pills-home" aria-selected="true">
                                <router-link to="/subject">Subjects</router-link>
                            </button>
                        </li>
                        <li class="nav-item">
                            <button class="nav-link active" id="pills-accounts-tab" data-bs-toggle="pill" type="button" role="tab" aria-controls="pills-home" aria-selected="true">
                                <router-link to="/location">Locations</router-link>
                            </button>
                        </li>
                        <li class="nav-item">
                            <button class="nav-link active" id="pills-accounts-tab" data-bs-toggle="pill" type="button" role="tab" aria-controls="pills-home" aria-selected="true">
                                <router-link to="/student">Students</router-link>
                            </button>
                        </li>
                        <li class="nav-item">
                            <button class="nav-link active" id="pills-accounts-tab" data-bs-toggle="pill" type="button" role="tab" aria-controls="pills-home" aria-selected="true">
                                <router-link to="/user">User</router-link>
                            </button>
                        </li>
                        <li class="nav-item">
                            <button class="nav-link active" id="pills-accounts-tab" data-bs-toggle="pill" type="button" role="tab" aria-controls="pills-home" aria-selected="true">
                                <router-link to="/attendance">Attendance</router-link>
                            </button>
                        </li>
                        <li class="nav-item">
                            <button class="nav-link active" id="pills-accounts-tab" data-bs-toggle="pill" type="button" role="tab" aria-controls="pills-home" aria-selected="true">
                                <router-link to="/timetable">Timetable</router-link>
                            </button>
                        </li>
                        <li class="nav-item">
                            <button class="nav-link active" id="pills-accounts-tab" data-bs-toggle="pill" type="button" role="tab" aria-controls="pills-home" aria-selected="true">
                                <button type="button" class="btn btn-primary" @click="logOut()">Logout</button>
                            </button>
                        </li>
                        <!-- 
                        <li class="nav-item">
                            <button class="nav-link active" id="pills-accounts-tab" data-bs-toggle="pill" type="button" role="tab" aria-controls="pills-home" aria-selected="true">
                                <router-link to="/eventtable">Eventtable</router-link>
                            </button>
                        </li> 
                        -->
                        <!-- 
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Dropdown
                            </a>
                            <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><a class="dropdown-item" href="#">Action</a></li>
                                <li><a class="dropdown-item" href="#">Another action</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item" href="#">Something else here</a></li>
                            </ul>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
                        </li> 
                        -->
                    </ul>

                    <!-- 
                    <form class="d-flex">
                        <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
                        <button class="btn btn-outline-success" type="submit">Search</button>
                    </form> 
                    -->
                </div>
            </div>
        </nav>
    </div>

    <div class="p-3 border">
        <router-view></router-view>
    </div>
</template>

<script setup>
    import {useUserStore} from '../src/stores/UserStore'
    import router from './router';
    const userStore = useUserStore()

    function logOut() {
        userStore.logOut()
        router.push('/login')
    }


</script>

<style scoped lang="scss">
    a {
        text-decoration: none;
        color:goldenrod;
    }
    a.router-link-active.router-link-exact-active {
        text-decoration: none;
        color: white;
        font-weight: 500;
        font-size: 1.08rem;
    }

    button.navbar-toggler {
        background-color: white;
    }
</style>