import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'

const SetoresView = () => import('@/views/SetoresView.vue')
const CamisasView = () => import('@/views/CamisasView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
        {
          path: 'setores',
          name: 'setores',
          component: SetoresView,
          children: [
            {
              path: ':id',
              name: 'camisas',
              component: CamisasView,
            }
          ]
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    }
  ]
})

export default router
