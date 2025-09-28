<template>
	<div id="container" class="mx-auto max-w-6xl px-4 sm:px-6">
		<header class="glass">
			<div class="bar">
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
						<!-- 🔘 Кнопка -->
						<button
							@click="showMatches = !showMatches"
							class="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
						>
							{{ showMatches ? '❌ ' : '⚽ ' }}
						</button>

						<!-- ⚽ Компонент матчей -->
						<Matches v-if="showMatches" />
					</div>

					<CurrencyRates />
					<DarkToggle />

					<form class="search" @submit.prevent="$router.push('/search/' + (q || ''))">
						<input v-model="q" type="search" placeholder="Поиск по новостям..." />
						<button>Искать</button>
					</form>

					<!-- бургер -->
					<div class="burger" :class="{ open: menuOpen }" @click="menuOpen = !menuOpen">
						<span></span><span></span><span></span>
					</div>

					<!-- выпадающее меню -->
					<transition name="fade">
						<div v-if="menuOpen" class="menu">
							<RouterLink to="/contacts" @click="closeMenu">📞 Контакты</RouterLink>
							<RouterLink to="/currency" @click="closeMenu">💱 Курсы валют</RouterLink>

							<hr />

							<RouterLink to="/category/politics" @click="closeMenu">Политика</RouterLink>
							<RouterLink to="/category/economy" @click="closeMenu">Экономика</RouterLink>
							<RouterLink to="/category/auto" @click="closeMenu">Авто</RouterLink>
							<RouterLink to="/category/sports" @click="closeMenu">Спорт</RouterLink>
							<RouterLink to="/category/news" @click="closeMenu">Новости</RouterLink>
							<RouterLink to="/category/science" @click="closeMenu">Наука</RouterLink
							><RouterLink to="/category/tech" @click="closeMenu">Технологии</RouterLink
							><RouterLink to="/category/incidents" @click="closeMenu">Происшествия</RouterLink
							><RouterLink to="/category/esports" @click="closeMenu">Киберспорт</RouterLink>
							<hr />

							<a href="#" target="_blank">📢 Telegram</a>
							<a href="#" target="_blank">👥 ВКонтакте</a>
							<a href="#" target="_blank">💬 Max</a>
						</div>
					</transition>
				</div>
			</div>
		</header>

		<!-- 🏃 Блок матчей (изначально скрыт) -->
		<transition name="slide-down">
			<div v-if="showMatches" class="pb-4">
				<LiveMatches />
			</div>
		</transition>

		<router-view />
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DarkToggle from './components/DarkToggle.vue'
import CurrencyRates from './components/CurrencyRates.vue'
import LiveMatches from './components/LiveMatches.vue'

const q = ref('')
const menuOpen = ref(false)
const showMatches = ref(false) // 🔑 Управление видимостью матчей

function closeMenu() {
	menuOpen.value = false
}
</script>

<style scoped>
/* центрируем и задаем максимальную ширину */
#container {
	max-width: 1100px;
	margin: 0 auto;
	padding: 16px;
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
	gap: 12px;
	align-items: center;
	padding: 12px 16px;
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
	gap: 8px;
	padding: 4px 6px;
	border-radius: 10px;
}
.logo a:hover {
	background: rgba(37, 99, 235, 0.08);
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

/* правая часть */
.right {
	margin-left: auto;
	display: flex;
	align-items: center;

	gap: 20px;
	position: relative;
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

/* анимация в крестик */
.burger.open span:nth-child(1) {
	transform: translateY(7.5px) rotate(45deg);
}
.burger.open span:nth-child(2) {
	opacity: 0;
}
.burger.open span:nth-child(3) {
	transform: translateY(-7.5px) rotate(-45deg);
}

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
	transition:
		background 0.3s ease,
		color 0.3s ease;

	/* фон под тему */
	background: #fff;
	max-height: 70vh; /* ограничим высоту */
	overflow-y: auto; /* добавляем скролл */
}

html.dark .menu {
	background: #1f2937; /* gray-800 */
	border-color: #374151;
}

.menu a {
	padding: 10px 16px;
	text-decoration: none;
	display: block;
	transition: background 0.2s;
}
.menu a:hover {
	background: rgba(37, 99, 235, 0.08); /* нейтральный hover */
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
.search input {
	width: 260px;
	padding: 8px 10px;
	border: 1px solid #e5e7eb;
	border-radius: 12px;
	outline: none;
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

@media (max-width: 600px) {
	.logo-text {
		width: 30px;
	}
	.logo {
		font-size: 16px;
	}
}

@media (max-width: 900px) {
	.search {
		display: none;
	}
}

/* 🔘 Адаптивность кнопки матчей */
@media (max-width: 768px) {
	.bar {
		flex-wrap: wrap;
		gap: 8px;
	}

	/* Переносим кнопку матчей на новую строку на мобильных */
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
</style>
