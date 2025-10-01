<template>
	<div class="pb-0">
		<!-- 🔘 Переключатель режимов -->
		<div class="flex gap-4 mb-4 flex-wrap">
			<button
				@click="mode = 'scroll'"
				:class="[
					'px-4 py-2 rounded-lg transition-all',
					mode === 'scroll'
						? 'bg-blue-600 text-white shadow-lg'
						: 'bg-gray-200 dark:bg-surface-alt hover:bg-gray-300 dark:hover:bg-surface-hover text-heading',
				]"
			>
				📊Все
			</button>
			<button
				@click="mode = 'marquee'"
				:class="[
					'px-4 py-2 rounded-lg transition-all',
					mode === 'marquee'
						? 'bg-blue-600 text-white shadow-lg'
						: 'bg-gray-200 dark:bg-surface-alt hover:bg-gray-300 dark:hover:bg-surface-hover text-heading',
				]"
			>
				🏃
			</button>
			<button
				@click="showFilters = !showFilters"
				:class="[
					'px-4 py-2 rounded-lg transition-all',
					showFilters
						? 'bg-purple-600 text-white shadow-lg'
						: 'bg-gray-200 dark:bg-surface-alt hover:bg-gray-300 dark:hover:bg-surface-hover text-heading',
				]"
			>
				⚙️
			</button>

			<RouterLink
				to="/widgets"
				class="px-4 py-2 rounded-lg transition-all bg-gray-200 dark:bg-surface-alt hover:bg-gray-300 dark:hover:bg-surface-hover text-heading"
			>
				📺
			</RouterLink>

			<RouterLink
				to="/tables"
				class="px-4 py-2 rounded-lg transition-all bg-gray-200 dark:bg-surface-alt hover:bg-gray-300 dark:hover:bg-surface-hover text-heading"
			>
				📊
			</RouterLink>
			<!-- 🔘 Переключатель подрежимов -->
			<div class="flex gap-2 mb-3">
				<!-- <button
					@click="scrollFilter = 'all'"
					:class="[
						'px-3 py-1 rounded-lg text-sm',
						scrollFilter === 'all'
							? 'bg-blue-600 text-white'
							: 'bg-gray-200 dark:bg-surface-alt text-heading hover:bg-gray-300 dark:hover:bg-surface-hover',
					]"
				>
					📋 Все
				</button> -->
				<button
					@click="scrollFilter = 'live'"
					:class="[
						'px-3 py-1 rounded-lg text-sm',
						scrollFilter === 'live'
							? 'bg-red-600 text-white'
							: 'bg-gray-200 dark:bg-surface-alt text-heading hover:bg-gray-300 dark:hover:bg-surface-hover',
					]"
				>
					🔴 Live
				</button>
				<button
					@click="scrollFilter = 'upcoming'"
					:class="[
						'px-3 py-1 rounded-lg text-sm',
						scrollFilter === 'upcoming'
							? 'bg-green-600 text-white'
							: 'bg-gray-200 dark:bg-surface-alt text-heading hover:bg-gray-300 dark:hover:bg-surface-hover',
					]"
				>
					⏰ Ожидание
				</button>
			</div>
		</div>

		<!-- 📊 Горизонтальная прокрутка -->
		<div v-if="mode === 'scroll'">
			<div class="flex overflow-x-auto gap-4 pb-3 scrollbar-hide">
				<div
					v-for="match in filteredScrollMatches"
					:key="match.id"
					class="shadow-lg border px-4 py-3 rounded-xl min-w-[300px] hover:scale-105 transition-transform duration-200 flex flex-col gap-2"
					:class="
						match.isLive
							? 'bg-white dark:bg-surface text-heading border-gray-200 dark:border-gray-700'
							: 'bg-blue-50 dark:bg-blue-alt text-heading border-blue-200 dark:border-blue-800'
					"
				>
					<!-- 🏆 Лига и время -->
					<div class="flex items-center justify-between text-s">
						<span class="font-bold text-blue-600 dark:text-blue-800">
							{{ getLeagueAbbr(match.league.name) }}
						</span>
						<span
							:class="['text-sm font-semibold', match.isLive ? 'text-red-500' : 'text-green-600 dark:text-green-800']"
						>
							{{ match.isLive ? 'LIVE' : formatMatchTime(match.fixture.date) }}
						</span>
					</div>

					<!-- ⚽ Команды и счёт -->
					<div class="flex items-center justify-between">
						<span class="text-sm font-medium truncate w-[100px]">
							{{ match.teams.home.name }}
						</span>

						<span v-if="match.isLive" class="text-lg font-bold w-[60px] text-center">
							{{ match.goals.home }} : {{ match.goals.away }}
						</span>
						<span v-else class="text-lg font-bold w-[60px] text-center text-gray-500 dark:text-gray-900"> VS </span>

						<span class="text-sm font-medium truncate w-[100px] text-right">
							{{ match.teams.away.name }}
						</span>
					</div>
				</div>

				<!-- 📴 Когда нет матчей -->
				<div
					v-if="filteredScrollMatches.length === 0"
					class="flex items-center justify-center min-w-[280px] text-gray-500 dark:text-gray-400"
				>
					⚽ Нет матчей
				</div>
			</div>
		</div>

		<!-- 🏃 Бегущая строка -->
		<div
			v-else
			class="relative overflow-hidden rounded-xl p-3 border text-heading bg-white dark:bg-surface border-gray-200 dark:border-gray-700"
		>
			<!-- 🔴 Заголовок -->
			<div class="flex items-center mb-2">
				<span v-if="hasLiveMatches" class="text-red-500 animate-pulse text-sm font-bold">🔴 LIVE</span>
				<span v-else class="text-gray-500 dark:text-gray-600 text-sm font-bold">Нет активных матчей</span>
				<span class="ml-2 text-xs text-gray-600 dark:text-gray-600">Обновлено: {{ lastUpdate }}</span>
				<span class="ml-2 text-xs" :class="isDemoData ? 'text-orange-500' : 'text-blue-600 dark:text-blue-400'">
					{{ currentSource }} {{ isDemoData ? '(demo)' : '' }}
				</span>
			</div>

			<!-- 📢 Бегущая строка -->
			<div class="overflow-hidden">
				<div class="inline-flex animate-marquee gap-6" :style="{ animationDuration: marqueeDuration }">
					<div
						v-for="match in filteredLiveMatches"
						:key="match.id"
						class="flex items-center gap-3 px-4 py-2 border rounded-lg min-w-[300px] bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
					>
						<span>{{ match.teams.home.name }}</span>
						<span class="text-red-500 font-bold"> {{ match.goals.home }} : {{ match.goals.away }} </span>
						<span>{{ match.teams.away.name }}</span>
					</div>
				</div>
			</div>
		</div>

		<!-- 🔧 Панель фильтров -->
		<transition name="fade">
			<div
				v-if="showFilters"
				class="mt-4 p-3 bg-gray-50 dark:bg-surface text-heading rounded-lg border border-gray-200 dark:border-gray-700"
			>
				<div class="flex flex-wrap gap-2 items-center">
					<span class="text-sm font-medium">Фильтры:</span>
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

				<div class="mt-2 text-xs text-gray-600 dark:text-gray-800">
					Всего: {{ filteredMatches.length }} | LIVE: {{ liveMatchesCount }} | Предстоящие: {{ upcomingMatchesCount }}
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
	fixture: { date: string; status: { short: string } }
	league: { name: string; country: string }
	teams: { home: { name: string }; away: { name: string } }
	goals: { home: number; away: number }
}

const matches = ref<Match[]>([])
const liveMatches = ref<Match[]>([])
const upcomingMatches = ref<Match[]>([])

const mode = ref<'scroll' | 'marquee'>('scroll')
const scrollFilter = ref<'all' | 'live' | 'upcoming'>('all')

const lastUpdate = ref('')
const currentSource = ref('')
const isDemoData = ref(false)

/* ====== Фильтры ====== */
const showFilters = ref(false)
const selectedCountries = ref<string[]>(['Europe', 'World','Russia', 'England', 'Spain', 'Italy', 'Germany', 'France'])
const availableCountries = ref([
	'Europe',
	'World',
	'Russia',
	'England',
	'Spain',
	'Italy',
	'Germany',
	'France',
	'Portugal',
	'Netherlands',
])

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api'

/* ====== Загрузка матчей ====== */
async function loadMatches() {
	try {
		const resUpcoming = await fetch(`${API_BASE}/matches`)
		const resLive = await fetch(`${API_BASE}/matches/live`)

		const upcomingData = resUpcoming.ok ? await resUpcoming.json() : { matches: [] }
		const liveData = resLive.ok ? await resLive.json() : { matches: [] }

		upcomingMatches.value = (upcomingData.matches || []).map((m: any) => ({
			id: m.id,
			isLive: false,
			fixture: { date: m.utcDate, status: { short: m.status } },
			league: { name: m.competition.name, country: m.area.name },
			teams: { home: { name: m.homeTeam.name }, away: { name: m.awayTeam.name } },
			goals: { home: 0, away: 0 },
		}))

		liveMatches.value = (liveData.matches || []).map((m: any) => ({
			id: m.id,
			isLive: true,
			fixture: { date: m.utcDate, status: { short: m.status } },
			league: { name: m.competition.name, country: m.area.name },
			teams: { home: { name: m.homeTeam.name }, away: { name: m.awayTeam.name } },
			goals: {
				home: m.score.fullTime.home ?? 0,
				away: m.score.fullTime.away ?? 0,
			},
		}))

		matches.value = [...liveMatches.value, ...upcomingMatches.value]

		currentSource.value = 'backend API'
		isDemoData.value = false
		lastUpdate.value = new Date().toLocaleTimeString('ru-RU')
	} catch (e) {
		console.error('Ошибка загрузки матчей:', e)
		matches.value = []
		currentSource.value = 'error'
		isDemoData.value = true
	}
}

onMounted(() => {
	loadMatches()
	setInterval(loadMatches, 15000)
})

/* ====== COMPUTED ====== */
const filteredMatches = computed(() =>
	matches.value.filter(match => selectedCountries.value.includes(match.league.country))
)

const filteredScrollMatches = computed(() => {
	if (scrollFilter.value === 'live') {
		return liveMatches.value.filter(match => selectedCountries.value.includes(match.league.country))
	}
	if (scrollFilter.value === 'upcoming') {
		return upcomingMatches.value.filter(match => selectedCountries.value.includes(match.league.country))
	}
	return filteredMatches.value
})

const filteredLiveMatches = computed(() =>
	liveMatches.value.filter(match => selectedCountries.value.includes(match.league.country))
)

const liveMatchesCount = computed(() => liveMatches.value.length)
const upcomingMatchesCount = computed(() => upcomingMatches.value.length)
const hasLiveMatches = computed(() => liveMatchesCount.value > 0)
const marqueeDuration = computed(() => `${Math.max(15, filteredLiveMatches.value.length * 5)}s`)

/* ====== HELPERS ====== */
const formatMatchTime = (d: string) => new Date(d).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })

const getLeagueAbbr = (name: string) => name.slice(0).toUpperCase()

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

<style>
:root {
	--surface-dark: oklch(0.71 0.04 257.34);
	--surface-alt-dark: oklch(0.68 0.04 257.34);
	--surface-hover-dark: oklch(0.63 0.05 257.34);
	--blue-alt-dark: oklch(0.7 0.05 250);
	--heading-light: #1f2937;
	--heading-dark: #e5e7eb;
}

.text-heading {
	color: var(--heading-light);
}
html.dark .text-heading {
	color: var(--heading-dark);
}

html.dark .dark\:bg-surface {
	background-color: var(--surface-dark) !important;
}
html.dark .dark\:bg-surface-alt {
	background-color: var(--surface-alt-dark) !important;
}
html.dark .dark\:hover\:bg-surface-hover:hover {
	background-color: var(--surface-hover-dark) !important;
}
html.dark .dark\:bg-blue-alt {
	background-color: var(--blue-alt-dark) !important;
}

/* 🔁 Анимация для бегущей строки */
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
</style>
