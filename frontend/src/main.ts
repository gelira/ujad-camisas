import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import { createPinia } from 'pinia'

import 'vuetify/styles'

import App from './App.vue'
import router from './router'

const app = createApp(App)

const vuetify = createVuetify()
const pinia = createPinia()

app.use(vuetify)
app.use(pinia)
app.use(router)

app.mount('#app')
