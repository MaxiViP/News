<template>
	<div id="container" class="mx-auto max-w-6xl px-2 sm:px-0 md:px-4 lg:px-6 xl:px-8">
		<header class="glass">
			<div class="bar flex justify-between items-center gap-3 px-2 sm:px-0 md:px-4 lg:px-6">
				<!-- логотип -->
				<h1 class="logo">
					<RouterLink to="/">
						<span class="logo-icon" aria-hidden="true">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
								<circle cx="128" cy="128" r="120" fill="#ef4444" />
								<text
									x="128"
									y="128"
									dominant-baseline="middle"
									text-anchor="middle"
									font-family="Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
									font-size="96"
									font-weight="700"
									fill="#fff"
								>
									NaN
								</text>
							</svg>
						</span>
						<span class="logo-text">News and News</span>
					</RouterLink>
				</h1>

				<!-- блок справа -->
				<div class="right">
					<!-- 🔘 Кнопка показать/скрыть матчи -->
					<div>
						<button
							@click="showMatches = !showMatches"
							class="match-toggle px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold transition"
						>
							{{ showMatches ? '❌' : '⚽' }}
						</button>
					</div>

					<CurrencyRates />
					<DarkToggle />

					<!-- 🔎 поиск -->
				<form class="search relative flex items-center" @submit.prevent="onSearchClick">
	<input
		ref="searchInput"
		v-model="q"
		type="search"
		:placeholder="expanded ? 'Выберите категорию' : ''"
		class="search-input transition-all duration-300 ease-in-out border rounded-lg py-2 pl-3 pr-10 dark:bg-gray-500 dark:text-white"
		:class="expanded ? 'expanded border-blue-500 ring-2 ring-blue-400' : 'border-gray-300 dark:border-gray-600'"
	/>

	<!-- кнопка-лупа -->
	<button
		type="button"
		@click="onSearchClick"
		:class="[
			'absolute right-0 flex items-center justify-center px-3 rounded-md transition',
			searchSuccess ? 'search-success' : 'text-gray-500 hover:text-blue-600',
		]"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class="h-5 w-5"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M21 21l-4.35-4.35M16.65 10.65a6 6 0 11-12 0 6 6 0 0112 0z"
			/>
		</svg>
	</button>
</form>


					<!-- бургер -->
					<div class="burger" :class="{ open: menuOpen }" @click="menuOpen = !menuOpen">
						<span></span><span></span><span></span>
					</div>

					<!-- выпадающее меню -->
					<transition name="fade">
						<div v-if="menuOpen" class="menu">
							<RouterLink to="/search" @click="closeMenu">Поиск</RouterLink>
							<RouterLink to="/contacts" @click="closeMenu">📞 Контакты</RouterLink>
							<RouterLink to="/currency" @click="closeMenu">💱 Курсы валют</RouterLink>
							<RouterLink to="/widgets" @click="closeMenu">📺 Виджеты</RouterLink>
							<RouterLink to="/tables" @click="closeMenu">📊 Таблицы</RouterLink>

							<hr />
							<RouterLink to="/category/news" @click="closeMenu">Новости</RouterLink>
							<RouterLink to="/category/politics" @click="closeMenu">Политика</RouterLink>
							<RouterLink to="/category/economy" @click="closeMenu">Экономика</RouterLink>
							<RouterLink to="/category/auto" @click="closeMenu">Авто</RouterLink>
							<RouterLink to="/category/sports" @click="closeMenu">Спорт</RouterLink>
							<RouterLink to="/category/science" @click="closeMenu">Наука</RouterLink>
							<RouterLink to="/category/tech" @click="closeMenu">Технологии</RouterLink>
							<RouterLink to="/category/incidents" @click="closeMenu">Происшествия</RouterLink>
							<RouterLink to="/category/esports" @click="closeMenu">Киберспорт</RouterLink>

							<hr />
							<a href="#" target="_blank">📢 Telegram</a>
							<a href="#" target="_blank">👥 ВКонтакте</a>
							<a href="#" target="_blank">💬 Max</a>
						</div>
					</transition>
				</div>
			</div>
		</header>

		<!-- 🏃 Блок матчей -->
		<transition name="slide-down">
			<div v-if="showMatches" class="pb-2">
				<LiveMatches />
			</div>
		</transition>

		<!-- Основной контент -->
		<router-view />
	</div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useNews } from './stores/news'

import DarkToggle from './components/DarkToggle.vue'
import CurrencyRates from './components/CurrencyRates.vue'
import LiveMatches from './components/LiveMatches.vue'

const q = ref('')
const expanded = ref(false)
const searchInput = ref<HTMLInputElement | null>(null)
const menuOpen = ref(false)
const showMatches = ref(false)
const router = useRouter()
const news = useNews()

// ✅ состояние для подсветки кнопки
const searchSuccess = ref(false)

function closeMenu() {
	menuOpen.value = false
}

async function onSearchClick() {
	if (!expanded.value) {
		expanded.value = true
		await nextTick()
		searchInput.value?.focus()
	} else if (expanded.value && !q.value) {
		expanded.value = false
	} else {
		await router.push('/search/' + q.value)
		await nextTick()

		if (!news.items.length) {
			// ❌ ничего не найдено
			q.value = ''
			expanded.value = false
		} else {
			// ✅ найдено — сворачиваем, очищаем и подсвечиваем кнопку
			expanded.value = false
			q.value = ''
			searchSuccess.value = true
			setTimeout(() => {
				searchSuccess.value = false
			}, 1000)
		}
	}
}

// ⌨️ ESC закрывает поиск
function onKey(e: KeyboardEvent) {
	if (e.key === 'Escape' && expanded.value) {
		expanded.value = false
		q.value = ''
	}
}
onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<style scoped>
/* центрируем и задаем максимальную ширину */
#container {
	max-width: 1100px;
	margin: 0 auto;
	padding: 16px;
}

.match-toggle {
	transition: all 0.3s ease;
	box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3); /* лёгкая тень */
}

/* ✨ hover */
.match-toggle:hover {
	background: #2563eb; /* более насыщенный синий */
	transform: translateY(-2px) scale(1.05);
	box-shadow: 0 6px 14px rgba(59, 130, 246, 0.5);
}

/* 🔥 focus */
.match-toggle:focus {
	outline: none;
	background: #1d4ed8;
	box-shadow:
		0 0 0 3px rgba(59, 130, 246, 0.5),
		0 8px 16px rgba(59, 130, 246, 0.6);
	transform: scale(1.05);
}

/* ⚡ active */
.match-toggle:active {
	transform: scale(0.95);
	background: #1e40af;
	box-shadow: 0 4px 8px rgba(30, 64, 175, 0.5);
}

/* «стеклянная» шапка */
.glass {
	position: sticky;
	top: 12px;
	z-index: 50;
	margin-bottom: 24px;
	border: 1px solid rgba(0, 0, 0, 0.06);
	border-radius: 16px;
	background: rgba(255, 255, 255, 0.7);
	backdrop-filter: blur(6px);
	box-shadow: 0 10px 20px -12px rgba(0, 0, 0, 0.15);
}

.bar {
	display: flex;
	justify-content: space-between;
	gap: 12px;
	align-items: center;
	/* padding: 12px 16px; */
}

.logo {
	margin: 0;
	font-size: 26px;
	font-weight: 600;
	letter-spacing: -0.02em;
}
.logo a {
	color: inherit;
	text-decoration: none;
	display: inline-flex;
	align-items: center;
	gap: 12px;
	padding: 6px 16px; /* как у match-toggle */
	border-radius: 12px;
	color: #fff; /* белый текст */
	font-weight: 600;
	transition: all 0.3s ease;
	box-shadow: 0 4px 10px rgba(59, 130, 246, 0.3);
}

/* hover */
.logo a:hover {
	/* background: #1d4ed8; */
	transform: translateY(-2px) scale(1.05);
	/* box-shadow: 0 6px 14px rgba(59, 130, 246, 0.5); */
}

/* focus */
.logo a:focus {
	outline: none;
	/* box-shadow:
		0 0 0 3px rgba(59, 130, 246, 0.5),
		0 8px 16px rgba(59, 130, 246, 0.6); */
	transform: scale(1.05);
}

/* active */
.logo a:active {
	background: #1e40af;
	transform: scale(0.95);
	box-shadow: 0 4px 8px rgba(30, 64, 175, 0.5);
}

.logo-icon {
	display: inline-flex;
	width: 28px;
	height: 28px;
}
.logo-icon svg {
	width: 100%;
	height: 100%;
	display: block;
}

.logo-text {
	color: #bc8048;
	font-weight: 700;
	transition: all 0.25s ease;
	position: relative;
	cursor: pointer;

	/* Чёткий рендеринг текста */
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-rendering: optimizeLegibility;
}

/* 🔥 hover */
.logo-text:hover {
	color: #e8a86a;
	text-shadow: 0 0 2px rgba(188, 128, 72, 0.3); /* меньше размытия */
	transform: scale(1.05);
}

/* ✨ focus */
.logo-text:focus {
	outline: none;
	color: #f0b77f;
	text-shadow: 0 0 2px rgba(188, 128, 72, 0.4);
	border-radius: 4px;
	box-shadow: 0 0 0 2px rgba(188, 128, 72, 0.3);
	transform: scale(1.03);
}

/* ⚡ active */
.logo-text:active {
	color: #8a5a32;
	transform: scale(0.97);
	text-shadow: 0 0 1px rgba(138, 90, 50, 0.6); /* минимум размытия */
}

/* правая часть */
.right {
	margin-left: auto;
	display: flex;
	align-items: center;
	gap: 20px;
	position: relative;
}

/* 🔗 Кнопки навигации */
.nav-btn {
	padding: 8px 16px;
	border-radius: 8px;
	background: #e5e7eb;
	color: #1f2937;
	transition: all 0.2s ease;
}
.nav-btn:hover {
	background: #d1d5db;
}
html.dark .nav-btn {
	background: #374151;
	color: #e5e7eb;
}
html.dark .nav-btn:hover {
	background: #4b5563;
}
/* активная ссылка */
.nav-active {
	background: #2563eb !important;
	color: #fff !important;
	font-weight: 600;
}

/* бургер */
.burger {
	width: 24px;
	height: 18px;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	cursor: pointer;
}
.burger span {
	display: block;
	height: 3px;
	width: 100%;
	background: #333;
	border-radius: 2px;
	transition: 0.3s;
}
.burger.open span:nth-child(1) {
	transform: translateY(7.5px) rotate(45deg);
}
.burger.open span:nth-child(2) {
	opacity: 0;
}
.burger.open span:nth-child(3) {
	transform: translateY(-7.5px) rotate(-45deg);
}

/* меню */
.menu {
	position: absolute;
	top: 100%;
	right: -15px;
	margin-top: 15px;
	border: 1px solid #ddd;
	border-radius: 8px;
	box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
	display: flex;
	flex-direction: column;
	min-width: 180px;
	z-index: 100;
	padding: 8px 0;
	background: #fff;
	max-height: 70vh;
	overflow-y: auto;
}
html.dark .menu {
	background: #1f2937;
	border-color: #374151;
}
.menu a {
	padding: 10px 16px;
	text-decoration: none;
	display: block;
	transition: background 0.2s;
}
.menu a:hover {
	background: rgba(37, 99, 235, 0.08);
}
.menu hr {
	border: none;
	border-top: 1px solid #ddd;
	margin: 6px 0;
}

/* анимация меню */
.fade-enter-active,
.fade-leave-active {
	transition: all 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
	transform: translateY(-5px);
}

/* поиск */
.search {
	display: flex;
	gap: 8px;
}

.search-success {
	background: #16a34a; /* насыщенный зелёный (green-600) */
	color: #fff; /* иконка белая */
	transform: scale(1.15);
	box-shadow:
		0 0 15px rgba(34, 197, 94, 0.9),
		0 0 30px rgba(34, 197, 94, 0.7);
	transition: all 0.25s ease;
	animation: pulse-success 0.8s ease-in-out;
}

@keyframes pulse-success {
	0% {
		transform: scale(1);
		box-shadow: 0 0 5px rgba(34, 197, 94, 0.5);
	}
	50% {
		transform: scale(1.2);
		box-shadow: 0 0 25px rgba(34, 197, 94, 1);
	}
	100% {
		transform: scale(1.15);
		box-shadow: 0 0 15px rgba(34, 197, 94, 0.9);
	}
}

.search-input {
	width: 0;
	opacity: 0;
	pointer-events: none;
}

.search-input.expanded {
	width: 12rem; /* 48 */
	opacity: 1;
	pointer-events: auto;
}

.search button {
	padding: 8px 12px;
	border: none;
	border-radius: 12px;
	background: #2563eb;
	color: #fff;
	font-weight: 600;
	cursor: pointer;
}
.search button:active {
	transform: translateY(1px);
}

/* 🔽 Анимация появления блока матчей */
.slide-down-enter-active,
.slide-down-leave-active {
	transition: all 0.3s ease;
}
.slide-down-enter-from {
	opacity: 0;
	transform: translateY(-20px);
}
.slide-down-leave-to {
	opacity: 0;
	transform: translateY(-20px);
}

@media (max-width: 900px) {
	.search {
		margin-left: 25px;
	}

	.search-input {
		position: absolute;
		top: 30px; /* под кнопкой */
		right: 0;
		width: 12rem;
		opacity: 0;
		pointer-events: none;
		transform: translateY(-10px);
		padding-right: 0;
	}

	.search-input.expanded {
		opacity: 1;
		pointer-events: auto;
		transform: translateY(0);
	}

	.right {
		margin-right: 6px;
	}

	.logo a {
		gap: 6px;
		padding: 6px 16px;
	}
}
@media (max-width: 768px) {
	.bar {
		flex-wrap: wrap;
		gap: 8px;
	}
	.bar > button {
		order: 2;
		width: 100%;
		text-align: center;
		margin-top: 8px;
	}
	.right {
		order: 1;
		margin-left: 0;
	}
}

@media (max-width: 600px) {
	.logo-text {
		display: none;
		/* width: 30px; */
	}
	.logo {
		font-size: 16px;
	}
}
</style>
