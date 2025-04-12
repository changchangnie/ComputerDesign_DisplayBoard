import { createApp } from 'https://unpkg.com/vue@3.2.47/dist/vue.esm-browser.js'
import Dashboard from './components/Dashboard.js'

const app = createApp({
    components: {
        Dashboard
    },
    template: `
    <Dashboard />
  `
})

app.mount('#app') 