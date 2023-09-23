import { createApp } from 'vue'
import { createPinia } from 'pinia'

import Toast from 'vue-toastification'
import { POSITION } from 'vue-toastification'
import router from './router/index.js'

import './styles/bootstrap.scss'

import '@sweet/dist/sweetalert2.min.css';
import '@vueloader/dist/css/index.css'
import '@vuetoasty/dist/index.css'

import Vue3ColorPicker from "vue3-colorpicker";
import "vue3-colorpicker/style.css";

import App from './App.vue'

createApp(App)
    .use(router)
    .use(Toast, { position: POSITION.TOP_CENTER, timeout: 2500 })
    .use(Vue3ColorPicker)
    .use(createPinia())
    .mount('#app')

import 'bootstrap/dist/js/bootstrap';