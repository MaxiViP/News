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
			<!-- 📺 Переход на страницу виджетов -->
			<RouterLink
				to="/widgets"
				class="px-4 py-2 rounded-lg transition-all bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
			>
				📺 Виджеты
			</RouterLink>

			<RouterLink
				to="/tables"
				class="px-4 py-2 rounded-lg transition-all bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
			>
				📊 Турнирные таблицы
			</RouterLink>
		</div>

		<!-- 📊 Горизонтальная прокрутка -->
		<div v-if="mode === 'scroll'" class="flex overflow-x-auto gap-4 pb-3 scrollbar-hide">
			<div
				v-for="match in filteredMatches"
				:key="match.id"
				:class="[
					'match shadow-lg border px-4 py-3 rounded-xl min-w-[300px] hover:scale-105 transition-transform duration-200 flex flex-col gap-2',
					match.isLive
						? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
						: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800',
				]"
			>
				<!-- 🏆 Лига и время -->
				<div class="flex items-center justify-between text-xs">
					<span class="font-bold text-blue-600 dark:text-blue-400">{{ getLeagueAbbr(match.league.name) }}</span>
					<span
						:class="['text-sm font-semibold', match.isLive ? 'text-red-500' : 'text-green-600 dark:text-green-400']"
					>
						{{ match.isLive ? `${match.fixture.status.elapsed}'` : formatMatchTime(match.fixture.date) }}
					</span>
				</div>

				<!-- ⚽ Команды и счёт -->
				<div class="flex items-center justify-between">
					<span class="text-sm font-medium text-gray-900 dark:text-white truncate text-left w-[100px]">
						{{ match.teams.home.name }}
					</span>

					<span v-if="match.isLive" class="text-lg font-bold text-center w-[60px]">
						{{ match.goals.home }} : {{ match.goals.away }}
					</span>
					<span v-else class="text-lg font-bold text-center w-[60px] text-gray-500 dark:text-gray-400"> VS </span>

					<span class="text-sm font-medium text-gray-900 dark:text-white truncate text-right w-[100px]">
						{{ match.teams.away.name }}
					</span>
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
				<span v-if="hasLiveMatches" class="text-red-500 animate-pulse text-sm font-bold">🔴 LIVE</span>
				<span v-else class="text-green-600 dark:text-green-400 text-sm font-bold">⏰ Расписание</span>
				<span class="ml-2 text-xs text-gray-600 dark:text-gray-400">Обновлено: {{ lastUpdate }}</span>
				<span class="ml-2 text-xs" :class="isDemoData ? 'text-orange-500' : 'text-blue-600 dark:text-blue-400'">
					{{ currentSource }} {{ isDemoData ? '(расписание)' : '' }}
				</span>
			</div>

			<!-- 📢 Бегущая строка -->
			<div class="overflow-hidden">
				<div class="inline-flex animate-marquee gap-6" :style="{ animationDuration: marqueeDuration }">
					<div
						v-for="match in filteredMatches"
						:key="match.id"
						:class="[
							'match flex items-center gap-3 shadow border px-4 py-2 rounded-lg hover:shadow-lg transition-shadow min-w-[320px]',
							match.isLive
								? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600'
								: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700',
						]"
					>
						<div class="flex items-center gap-2 flex-1 justify-between">
							<span>{{ match.teams.home.name }}</span>
							<span v-if="match.isLive">{{ match.goals.home }} : {{ match.goals.away }}</span>
							<span v-else>{{ formatMatchTime(match.fixture.date) }}</span>
							<span>{{ match.teams.away.name }}</span>
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
					Матчей: {{ filteredMatches.length }} (LIVE: {{ liveMatchesCount }}, Предстоящие: {{ upcomingMatchesCount }}) |
					Источник: {{ currentSource }} {{ isDemoData ? '(расписание)' : '' }}
				</div>
			</div>
		</transition>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Match {
	id: number
	isLive: boolean
	fixture: { date: string; status: { elapsed: number; short: string } }
	league: { name: string; country: string }
	teams: { home: { name: string }; away: { name: string } }
	goals: { home: number; away: number }
}

const matches = ref<Match[]>([])
const mode = ref<'scroll' | 'marquee'>('marquee')
const lastUpdate = ref('')
const currentSource = ref('')
const isDemoData = ref(false)

/* Фильтры */
const showFilters = ref(false)
const selectedCountries = ref<string[]>(['England', 'Spain', 'Italy', 'Germany', 'France', 'Russia'])
const availableCountries = ref([
	'England',
	'Spain',
	'Italy',
	'Germany',
	'France',
	'Russia',
	'Portugal',
	'Netherlands',
	'Europe',
	'World',
])

/* ====== ДОПОЛНИТЕЛЬНЫЕ ИСТОЧНИКИ ====== */
async function loadFromFootballDataOrg() {
	try {
		const API_KEY = import.meta.env.VITE_FOOTBALL_DATA_KEY
		const res = await fetch(`https://api.football-data.org/v4/matches`, {
			headers: { 'X-Auth-Token': API_KEY },
		})
		const data = await res.json()
		return (data.matches || []).map((m: any) => ({
			id: m.id,
			isLive: m.status === 'LIVE',
			fixture: { date: m.utcDate, status: { elapsed: 0, short: m.status } },
			league: { name: m.competition.name, country: m.area.name },
			teams: { home: { name: m.homeTeam.name }, away: { name: m.awayTeam.name } },
			goals: { home: m.score.fullTime.home ?? 0, away: m.score.fullTime.away ?? 0 },
		}))
	} catch {
		return []
	}
}

async function loadFromRapidApi() {
	try {
		const API_KEY = import.meta.env.VITE_RAPIDAPI_KEY
		const res = await fetch('https://free-api-live-football-data.p.rapidapi.com/football/live', {
			headers: {
				'X-RapidAPI-Key': API_KEY,
				'X-RapidAPI-Host': 'free-api-live-football-data.p.rapidapi.com',
			},
		})
		const data = await res.json()
		return (data?.data || []).map((m: any, i: number) => ({
			id: i + 10000,
			isLive: true,
			fixture: { date: m.time, status: { elapsed: 0, short: 'LIVE' } },
			league: { name: m.league, country: m.country },
			teams: { home: { name: m.home }, away: { name: m.away } },
			goals: { home: m.homeScore ?? 0, away: m.awayScore ?? 0 },
		}))
	} catch {
		return []
	}
}

function loadFallback() {
	return [
		{
			id: 1,
			isLive: false,
			fixture: { date: new Date().toISOString(), status: { elapsed: 0, short: 'NS' } },
			league: { name: 'Premier League', country: 'England' },
			teams: { home: { name: 'Arsenal' }, away: { name: 'Chelsea' } },
			goals: { home: 0, away: 0 },
		},
	]
}

/* ====== ЛОГИКА ЗАГРУЗКИ ====== */
async function loadMatches() {
	let data = await loadFromFootballDataOrg()
	if (data.length) {
		matches.value = data
		currentSource.value = 'football-data.org'
		isDemoData.value = false
		lastUpdate.value = new Date().toLocaleTimeString('ru-RU')
		return
	}

	data = await loadFromRapidApi()
	if (data.length) {
		matches.value = data
		currentSource.value = 'Free API Live Football Data'
		isDemoData.value = false
		lastUpdate.value = new Date().toLocaleTimeString('ru-RU')
		return
	}

	matches.value = loadFallback()
	currentSource.value = 'Fallback'
	isDemoData.value = true
	lastUpdate.value = new Date().toLocaleTimeString('ru-RU')
}

onMounted(() => loadMatches())

/* ====== COMPUTED ====== */
const filteredMatches = computed(() =>
	matches.value.filter(match => selectedCountries.value.includes(match.league.country))
)

const liveMatchesCount = computed(() => filteredMatches.value.filter(m => m.isLive).length)
const upcomingMatchesCount = computed(() => filteredMatches.value.filter(m => !m.isLive).length)
const hasLiveMatches = computed(() => liveMatchesCount.value > 0)
const marqueeDuration = computed(() => `${Math.max(30, filteredMatches.value.length * 5)}s`)

const formatMatchTime = (d: string) => new Date(d).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
const getLeagueAbbr = (name: string) => name.slice(0, 3).toUpperCase()
const getCountryName = (code: string) => {
	const names: Record<string, string> = {
		England: 'Англия',
		Spain: 'Испания',
		Italy: 'Италия',
		Germany: 'Германия',
		France: 'Франция',
		Russia: 'Россия',
		Portugal: 'Португалия',
		Netherlands: 'Нидерланды',
		Europe: 'Европа',
		World: 'Мир',
	}
	return names[code] || code
}
</script>
