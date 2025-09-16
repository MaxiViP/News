import { createRouter, createWebHistory } from 'vue-router'
import CategoryView from './views/CategoryView.vue'
const routes = [
  { path: '/', redirect: '/category/politics' },
  { path: '/category/:category', component: CategoryView },
  { path: '/search/:q?', component: () => import('./views/SearchView.vue') }
]
export default createRouter({ history: createWebHistory(), routes })
