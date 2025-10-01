import { createRouter, createWebHistory } from 'vue-router'
import CategoryView from './views/CategoryView.vue'
import LiveMatches from './components/LiveMatches.vue'
import WidgetsView from './views/WidgetsView.vue'
import LeagueTablesView from './views/LeagueTablesView.vue'

const routes = [
	// 📰 редирект на новости по умолчанию
	{ path: '/', redirect: '/category/news' },

	// категории
	{ path: '/category/:category', name: 'category', component: CategoryView },

	// поиск
	{ path: '/search/:q?', name: 'search', component: () => import('./views/SearchView.vue') },

	// контакты
	{ path: '/contacts', name: 'contacts', component: () => import('./views/ContactsView.vue') },

	// валюта
	{ path: '/currency', name: 'currency', component: () => import('./views/CurrencyPage.vue') },

	// матчи
	{ path: '/matches', name: 'matches', component: LiveMatches },

	// виджеты
	{ path: '/widgets', name: 'widgets', component: WidgetsView },

	// таблицы
	{ path: '/tables', name: 'tables', component: LeagueTablesView },
]

export default createRouter({
	history: createWebHistory(),
	routes,
})
