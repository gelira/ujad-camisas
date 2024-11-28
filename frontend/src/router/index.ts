import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'

const CamisasView = () => import('@/views/CamisasView.vue')

export const ROUTES = {
  HOME: 'home',
  LOGIN: 'login',
  CAMISAS: 'camisas'
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: ROUTES.HOME,
      component: HomeView,
      children: [
        {
          path: 'camisas/:id',
          name: ROUTES.CAMISAS,
          component: CamisasView,
        }
      ]
    },
    {
      path: '/login',
      name: ROUTES.LOGIN,
      component: LoginView
    }
  ]
})

export default router
