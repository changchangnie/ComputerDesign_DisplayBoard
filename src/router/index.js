import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/components/Dashboard.vue'
import Section1 from '@/components/Section1.vue'
import Section2 from '@/components/Section2.vue'
import Section3 from '@/components/Section3.vue'

const routes = [
    {
        path: '/',
        name: 'Dashboard',
        component: Dashboard
    },
    {
        path: '/section1',
        name: 'Section1',
        component: Section1
    },
    {
        path: '/section2',
        name: 'Section2',
        component: Section2
    },
    {
        path: '/section3',
        name: 'Section3',
        component: Section3
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 添加导航守卫
router.beforeEach((to, from, next) => {
    console.log('Navigating to:', to.path)
    next()
})

export default router 