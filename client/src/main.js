import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import moment from 'moment'
import Maska from 'maska'

const app = createApp(App)
app.config.globalProperties.$moment = moment
app.use(Maska)

app.use(store).use(router).mount('#app')
