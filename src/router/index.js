import { createRouter, createWebHistory } from 'vue-router'
import ContractAnalyzer from '../views/ContractAnalyzer.vue'

const routes = [
  {
    path: '/',
    name: 'Analyze',
    component: ContractAnalyzer
  },
  {
    path: '/reports',
    name: 'ReportsPage',
    component: () => import('../views/ReportsPage.vue')
  },
  {
    path: '/how-it-works',
    name: 'HowItWorks',
    component: () => import('../views/HowItWorks.vue')
  },
  {
    path: '/faqs',
    name: 'FAQsPage',
    component: () => import('../views/FAQsPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router