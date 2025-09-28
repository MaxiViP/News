import { createRouter, createWebHistory } from 'vue-router'
import CategoryView from './views/CategoryView.vue'
import LiveMatches from './components/LiveMatches.vue'
import WidgetsView from './views/WidgetsView.vue'
import LeagueTablesView from './views/LeagueTablesView.vue'

const routes = [
	{ path: '/', redirect: '/category/politics' },
	{ path: '/category/:category', component: CategoryView },
	{ path: '/search/:q?', component: () => import('./views/SearchView.vue') },
	{ path: '/contacts', component: () => import('./views/ContactsView.vue') },
	{ path: '/currency', component: () => import('./views/CurrencyPage.vue') },
	{ path: '/matches', name: 'matches', component: LiveMatches },
	{ path: '/widgets', name: 'widgets', component: WidgetsView },
	{ path: '/tables', name: 'tables', component: LeagueTablesView }, // 🔥 новая страница
]

export default createRouter({
	history: createWebHistory(),
	routes,
})
