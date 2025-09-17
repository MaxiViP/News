import { createRouter, createWebHistory } from 'vue-router'
import CategoryView from './views/CategoryView.vue'

const routes = [
	{ path: '/', redirect: '/category/politics' },
	{ path: '/category/:category', component: CategoryView },
	{ path: '/search/:q?', component: () => import('./views/SearchView.vue') },
	{ path: '/contacts', component: () => import('./views/ContactsView.vue') }, // ✅ добавили
]

export default createRouter({
	history: createWebHistory(),
	routes,
})
