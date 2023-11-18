import { createApp } from 'vue'

import 'vuetify/styles'

import { createVuetify } from 'vuetify'

const vuetify = createVuetify()

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(vuetify)
app.use(router)

app.mount('#app')
