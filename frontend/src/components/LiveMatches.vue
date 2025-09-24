<template>
	<div class="pb-4">
		<!-- 🔘 Переключатель режимов -->
		<div class="flex gap-4 mb-4 flex-wrap">
			<button
				@click="mode = 'scroll'"
				:class="[
					'px-4 py-2 rounded-lg transition-all',
					mode === 'scroll'
						? 'bg-blue-600 text-white shadow-lg'
						: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600',
				]"
			>
				📊 Горизонтально
			</button>
			<button
				@click="mode = 'marquee'"
				:class="[
					'px-4 py-2 rounded-lg transition-all',
					mode === 'marquee'
						? 'bg-blue-600 text-white shadow-lg'
						: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600',
				]"
			>
				🏃 Бегущая строка
			</button>
			<button
				@click="toggleAutoRefresh"
				:class="[
					'px-4 py-2 rounded-lg transition-all',
					autoRefresh
						? 'bg-green-600 text-white shadow-lg'
						: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600',
				]"
			>
				{{ autoRefresh ? '⏸️ Пауза' : '▶️ Автообновление' }}
			</button>

			<!-- 🔽 Кнопка фильтров -->
			<button
				@click="showFilters = !showFilters"
				:class="[
					'px-4 py-2 rounded-lg transition-all',
					showFilters
						? 'bg-purple-600 text-white shadow-lg'
						: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600',
				]"
			>
				⚙️ Фильтры
			</button>
		</div>

		<!-- 📊 Горизонтальная прокрутка -->
		<div v-if="mode === 'scroll'" class="flex overflow-x-auto gap-4 pb-3 scrollbar-hide">
			<div
				v-for="match in filteredMatches"
				:key="match.id"
				class="match bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-xl min-w-[300px] hover:scale-105 transition-transform duration-200 flex flex-col gap-2"
			>
				<!-- 🏆 Лига и время -->
				<div class="flex items-center justify-between text-xs">
					<span class="font-bold text-blue-600 dark:text-blue-400">{{ getLeagueAbbr(match.league.name) }}</span>
					<span class="text-gray-500">{{ match.fixture.status.elapsed }}'</span>
				</div>

				<!-- ⚽ Команды и счёт -->
				<div class="flex items-center justify-between">
					<span class="text-sm font-medium text-gray-900 dark:text-white truncate text-left w-[100px]">
						{{ match.teams.home.name }}
					</span>

					<span class="text-lg font-bold text-center w-[60px]"> {{ match.goals.home }} : {{ match.goals.away }} </span>

					<span class="text-sm font-medium text-gray-900 dark:text-white truncate text-right w-[100px]">
						{{ match.teams.away.name }}
					</span>
				</div>

				<!-- 🔴 Индикатор LIVE -->
				<div class="flex justify-end">
					<div class="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Live"></div>
				</div>
			</div>

			<!-- 📴 Когда нет матчей -->
			<div
				v-if="filteredMatches.length === 0"
				class="flex items-center justify-center min-w-[280px] text-gray-500 dark:text-gray-400"
			>
				⚽ Нет активных матчей
			</div>
		</div>

		<!-- 🏃 Бегущая строка -->
		<div
			v-else
			class="relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-3 border border-gray-200 dark:border-gray-700"
		>
			<!-- 🔴 Заголовок -->
			<div class="flex items-center mb-2">
				<span class="text-red-500 animate-pulse text-sm font-bold">🔴 LIVE</span>
				<span class="ml-2 text-xs text-gray-600 dark:text-gray-400">Обновлено: {{ lastUpdate }}</span>
				<span class="ml-2 text-xs" :class="isDemoData ? 'text-orange-500' : 'text-blue-600 dark:text-blue-400'">
					{{ currentSource }} {{ isDemoData ? '(демо)' : '' }}
				</span>
			</div>

			<!-- 📢 Бегущая строка -->
			<div class="overflow-hidden">
        
				<div  class="inline-flex animate-marquee gap-6" :style="{ animationDuration: marqueeDuration }">
					<div
						v-for="match in filteredMatches"
						:key="match.id"
						:class="[
							'match flex items-center gap-3 bg-white dark:bg-gray-800 shadow border border-gray-200 dark:border-gray-600 px-4 py-2 rounded-lg hover:shadow-lg transition-shadow min-w-[320px]',
							{ 'goal-flash': isGoal(match) },
							{ 'demo-match': isDemoData },
						]"
					>
						<!-- 🏆 Лига -->
						<span class="text-[10px] font-bold text-blue-600 dark:text-blue-400 w-[40px] text-center">
							{{ getLeagueAbbr(match.league.name) }}
						</span>

						<!-- 🏟️ Команды -->
						<div class="flex items-center gap-2 flex-1 justify-between">
							<!-- Домашняя -->
							<div class="flex items-center gap-1 min-w-[100px] truncate">
								<img
									v-if="match.teams.home.logo"
									:src="match.teams.home.logo"
									alt="home logo"
									class="w-5 h-5 object-contain"
								/>
								<span class="text-sm font-medium text-gray-900 dark:text-white truncate">{{
									match.teams.home.name
								}}</span>
							</div>

							<!-- ⚽ Счёт -->
							<div class="text-lg font-extrabold text-blue-600 dark:text-blue-400 w-[60px] text-center">
								{{ match.goals.home }} : {{ match.goals.away }}
							</div>

							<!-- Гости -->
							<div class="flex items-center gap-1 min-w-[100px] truncate justify-end">
								<span class="text-sm font-medium text-gray-900 dark:text-white truncate text-right">{{
									match.teams.away.name
								}}</span>
								<img
									v-if="match.teams.away.logo"
									:src="match.teams.away.logo"
									alt="away logo"
									class="w-5 h-5 object-contain"
								/>
							</div>
						</div>

						<!-- ⏱️ Время + 🔴 -->
						<div class="flex items-center gap-1 w-[50px] justify-end">
							<span class="text-xs text-red-500 font-bold">{{ match.fixture.status.elapsed }}'</span>
							<div class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- 🔧 Панель фильтров -->
		<transition name="fade">
			<div
				v-if="showFilters"
				class="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
			>
				<div class="flex flex-wrap gap-2 items-center">
					<span class="text-sm font-medium text-gray-700 dark:text-gray-300">Фильтры:</span>
					<label v-for="country in availableCountries" :key="country" class="flex items-center gap-1 cursor-pointer">
						<input
							type="checkbox"
							v-model="selectedCountries"
							:value="country"
							class="rounded text-blue-600 focus:ring-blue-500"
						/>
						<span class="text-sm">{{ getCountryName(country) }}</span>
					</label>
				</div>

				<div class="mt-2 text-xs text-gray-600 dark:text-gray-400">
					Матчей: {{ filteredMatches.length }} | Источник: {{ currentSource }} {{ isDemoData ? '(демо)' : '' }}
				</div>
			</div>
		</transition>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'

const prevScores = ref<Record<number, string>>({})
const isDemoData = ref(false) // 🔑 Флаг для определения демо-данных

function isGoal(match: Match) {
	const currentScore = `${match.goals.home}:${match.goals.away}`
	const prev = prevScores.value[match.id]
	prevScores.value[match.id] = currentScore
	return prev && prev !== currentScore // 👈 вернёт true, если счёт изменился
}

interface Match {
	id: number
	fixture: {
		status: {
			elapsed: number
			short: string
		}
	}
	league: {
		id: number
		name: string
		country: string
		logo: string
	}
	teams: {
		home: {
			id: number
			name: string
			logo: string
		}
		away: {
			id: number
			name: string
			logo: string
		}
	}
	goals: {
		home: number
		away: number
	}
}

const matches = ref<Match[]>([])
const mode = ref<'scroll' | 'marquee'>('marquee')
const autoRefresh = ref(true)
const selectedCountries = ref<string[]>([
	'Russia',
	'England',
	'Spain',
	'Italy',
	'Germany',
	'France',
	'World',
	'Europe',
	'South America',
])
const currentSource = ref('API-Football')
const lastUpdate = ref('')

// 🔄 Доступные страны для фильтрации
const availableCountries = ref([
	'Russia',
	'England',
	'Spain',
	'Italy',
	'Germany',
	'France',
	'World',
	'Europe',
	'South America',
	'Portugal',
	'Netherlands',
])

// 📊 Отфильтрованные матчи
const filteredMatches = computed(() => {
	return matches.value.filter(match => selectedCountries.value.includes(match.league.country))
})

// ⏱️ Длительность анимации бегущей строки
const marqueeDuration = computed(() => {
	const count = filteredMatches.value.length
	return `${Math.max(30, count * 5)}s`
})

// 🏆 Сокращения названий лиг
const getLeagueAbbr = (name: string) => {
	const abbrs: Record<string, string> = {
		'Premier League': 'APL',
		'La Liga': 'LL',
		'Serie A': 'SA',
		Bundesliga: 'BL',
		'Ligue 1': 'L1',
		'Russian Premier League': 'RPL',
		'Champions League': 'UCL',
		'Europa League': 'UEL',
		'World Cup': 'WC',
		'European Championship': 'EC',
		'Copa America': 'CA',
	}
	return abbrs[name] || name.slice(0, 3).toUpperCase()
}

// 🌍 Названия стран
const getCountryName = (code: string) => {
	const names: Record<string, string> = {
		Russia: 'Россия',
		England: 'Англия',
		Spain: 'Испания',
		Italy: 'Италия',
		Germany: 'Германия',
		France: 'Франция',
		World: 'Мир',
		Europe: 'Европа',
		'South America': 'Юж. Америка',
		Portugal: 'Португалия',
		Netherlands: 'Нидерланды',
	}
	return names[code] || code
}

// 🔄 Переключение автообновления
const toggleAutoRefresh = () => {
	autoRefresh.value = !autoRefresh.value
}

// ⚽ Загрузка матчей из https://rapidapi.com/api-sports/api/api-football/playground (основной источник, head-to-head)
async function loadFromApiFootball() {
	try {
		// 🔑 Твой ключ API (лучше хранить в .env)
		const API_KEY = import.meta.env.VITE_API_FOOTBALL_KEY || '3de7e47a73mshd56da98f1e6a5a3p18460bjsn0dad520b272b'

		const response = await fetch('https://api-football-v1.p.rapidapi.com/v3/fixtures/headtohead?h2h=33-34', {
			headers: {
				'x-rapidapi-key': API_KEY,
				'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
			},
		})

		if (!response.ok) throw new Error('API error')

		const data = await response.json()
		if (data.response && data.response.length > 0) {
			matches.value = data.response
			currentSource.value = 'API-Football (H2H)'
			lastUpdate.value = new Date().toLocaleTimeString('ru-RU')
			isDemoData.value = false // 🔑 Это настоящие данные
			console.log(`✅ Загружено ${data.response.length} настоящих матчей`)
			return true // 🔑 Успешно загрузили настоящие данные
		} else {
			console.log('ℹ️ API вернул пустой ответ')
			return false // 🔑 Нет настоящих данных
		}
	} catch (error) {
		console.warn('API-Football недоступен:', error)
		return false // 🔑 Ошибка загрузки
	}
}

// 🔄 Запасные источники (Football-Data.org)
async function loadFromBackupSources() {
	try {
		const FD_KEY = import.meta.env.VITE_FOOTBALL_DATA_KEY || '563b1e8db9574057a9bae05e33cbbe85'

		if (!FD_KEY) {
			throw new Error('Football Data key not found')
		}

		const response = await fetch('https://api.football-data.org/v4/matches', {
			headers: { 'X-Auth-Token': FD_KEY },
		})

		if (response.status === 429) {
			console.warn('⚠️ Лимит запросов Football-Data.org исчерпан')
			throw new Error('Rate limit exceeded')
		}

		if (response.ok) {
			const data = await response.json()

			const liveMatches = data.matches
				.filter((match: any) => match.status === 'LIVE' || match.status === 'IN_PLAY')
				.map((match: any) => ({
					id: match.id,
					fixture: {
						status: {
							elapsed: match.minute || 0,
							short: match.status || 'LIVE',
						},
					},
					league: {
						name: match.competition?.name || 'Unknown',
						country: match.area?.name || 'World',
					},
					teams: {
						home: { name: match.homeTeam?.name || 'Home' },
						away: { name: match.awayTeam?.name || 'Away' },
					},
					goals: {
						home: match.score?.home ?? 0,
						away: match.score?.away ?? 0,
					},
				}))

			if (liveMatches.length > 0) {
				matches.value = liveMatches
				currentSource.value = 'Football-Data.org'
				lastUpdate.value = new Date().toLocaleTimeString('ru-RU')
				isDemoData.value = false // 🔑 Это настоящие данные
				console.log(`✅ Загружено ${liveMatches.length} настоящих матчей с Football-Data.org`)
				return true // 🔑 Успешно загрузили настоящие данные
			} else {
				console.log('ℹ️ Нет активных матчей в Football-Data.org')
				return false // 🔑 Нет настоящих данных
			}
		}
	} catch (error) {
		console.warn('⚠️ Football-Data.org недоступен:', error)
		return false // 🔑 Ошибка загрузки
	}
	return false
}

// 📋 Демо-данные для тестирования (только если нет настоящих)
function loadDemoData() {
	// 🔑 Загружаем демо-данные только если флаг isDemoData true или нет других данных
	if (matches.value.length === 0 || isDemoData.value) {
		matches.value = [
			{
				id: 1,
				fixture: { status: { elapsed: 63, short: 'LIVE' } },
				league: { name: 'Premier League', country: 'England' },
				teams: { home: { name: 'Arsenal' }, away: { name: 'Chelsea' } },
				goals: { home: 2, away: 1 },
			},
			{
				id: 2,
				fixture: { status: { elapsed: 45, short: 'LIVE' } },
				league: { name: 'La Liga', country: 'Spain' },
				teams: { home: { name: 'Real Madrid' }, away: { name: 'Barcelona' } },
				goals: { home: 1, away: 0 },
			},
			{
				id: 3,
				fixture: { status: { elapsed: 78, short: 'LIVE' } },
				league: { name: 'Russian Premier League', country: 'Russia' },
				teams: { home: { name: 'Спартак' }, away: { name: 'Зенит' } },
				goals: { home: 99, away: 1 },
			},
			{
				id: 4,
				fixture: { status: { elapsed: 63, short: 'LIVE' } },
				league: { name: 'Premier League', country: 'England' },
				teams: { home: { name: 'Manchester United' }, away: { name: 'Manchester City' } },
				goals: { home: 0, away: 4 },
			},
			{
				id: 5,
				fixture: { status: { elapsed: 45, short: 'LIVE' } },
				league: { name: 'La Liga', country: 'Spain' },
				teams: { home: { name: 'Valencia' }, away: { name: 'Sevilla' } },
				goals: { home: 3, away: 2 },
			},
			{
				id: 6,
				fixture: { status: { elapsed: 78, short: 'LIVE' } },
				league: { name: 'Russian Premier League', country: 'Russia' },
				teams: { home: { name: 'Цска' }, away: { name: 'Локомотив' } },
				goals: { home: 0, away: 0 },
			},
		]
		currentSource.value = 'Демо-данные'
		lastUpdate.value = new Date().toLocaleTimeString('ru-RU') + ' (демо)'
		isDemoData.value = true // 🔑 Это демо-данные
		console.log('📋 Загружены демо-данные')
	}
}

// 🔄 Основная функция загрузки
async function loadLiveMatches() {
	if (!autoRefresh.value) return

	try {
		// 🔑 Пытаемся загрузить настоящие данные
		const apiFootballSuccess = await loadFromApiFootball()
		
		// 🔑 Если не получилось с первым API, пробуем второй
		if (!apiFootballSuccess) {
			const backupSuccess = await loadFromBackupSources()
			
			// 🔑 Если оба API не сработали, показываем демо-данные
			if (!backupSuccess) {
				loadDemoData()
			}
		}
	} catch (error) {
		console.error('Ошибка загрузки матчей:', error)
		// 🔑 При ошибке тоже показываем демо-данные
		loadDemoData()
	}
}

// 🎯 Инициализация
onMounted(() => {
	loadLiveMatches()

	// Автообновление каждые 30 секунд
	const interval = setInterval(() => {
		if (autoRefresh.value) {
			loadLiveMatches()
		}
	}, 30000)

	// Очистка интервала при размонтировании
	return () => clearInterval(interval)
})

// 👀 Следим за изменением автообновления
watch(autoRefresh, newVal => {
	if (newVal) {
		loadLiveMatches()
	}
})

const showFilters = ref(false) // 👈 управление отображением фильтров
</script>

<style scoped>
/* ⚡ Анимация мигания при голе */
@keyframes goalFlash {
	0% {
		background-color: #22c55e33;
	}
	50% {
		background-color: #22c55e66;
	}
	100% {
		background-color: transparent;
	}
}

.goal-flash {
	animation: goalFlash 2s ease-in-out;
}

/* 🎭 Стиль для демо-матчей */
.demo-match {
	opacity: 0.8;
	border-left: 3px solid #f59e0b;
}

.scrollbar-hide {
	scrollbar-width: none;
	-ms-overflow-style: none;
}

.scrollbar-hide::-webkit-scrollbar {
	display: none;
}

/* плавное появление/исчезновение фильтров */
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

/* 🔄 Анимация бегущей строки */
@keyframes marquee {
	0% {
		transform: translateX(100%);
	}
	100% {
		transform: translateX(-100%);
	}
}

.animate-marquee {
	animation: marquee linear infinite;
}

.animate-marquee:hover {
	animation-play-state: paused;
}

/* 📱 Адаптивность */
@media (max-width: 768px) {
	.match {
		min-width: 260px !important;
		padding: 0.75rem !important;
		font-size: 0.875rem;
	}
}

/* 🎨 Темная тема улучшения */
.dark .match {
	border-color: #374151;
}

.dark .match:hover {
	border-color: #4b5563;
}

.dark .demo-match {
	border-left: 3px solid #d97706;
	opacity: 0.9;
}
</style>