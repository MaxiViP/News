<template>
	<div class="space-y-6">
		<!-- Matches -->
		<div class="bg-white dark:bg-surface p-0 rounded-lg shadow">
			<!-- Tabs -->
			<div class="flex flex-wrap gap-2 sm:gap-4 mb-4">
				<button
					@click="tab = 'upcoming'"
					:class="[
						'px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base transition-all flex-1 sm:flex-none text-center',
						tab === 'upcoming'
							? 'bg-blue-600 text-white shadow-lg'
							: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-200',
					]"
				>
					⚽ Upcoming
				</button>
				<button
					@click="tab = 'live'"
					:class="[
						'px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base transition-all flex-1 sm:flex-none text-center',
						tab === 'live'
							? 'bg-red-600 text-white shadow-lg'
							: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-200',
					]"
				>
					🔴 Live
				</button>
			</div>

			<!-- Header -->
			<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
				<h2 class="text-base sm:text-lg font-semibold">
					{{ tab === 'upcoming' ? '⚽ Upcoming Matches' : '🔴 Live Matches' }}
				</h2>
				<div class="text-xs text-gray-500 dark:text-gray-400">
					{{ lastUpdated ? `Updated: ${lastUpdated}` : 'Loading…' }}
				</div>
			</div>

			<!-- Matches grouped by competition -->
			<div v-if="Object.keys(groupedMatches).length > 0" class="space-y-6">
				<div
					v-for="(matches, compId) in groupedMatches"
					:key="compId"
					class="rounded border border-gray-200 dark:border-gray-700 overflow-hidden"
				>
					<!-- Заголовок турнира -->
					<div
						class="flex items-center gap-2 px-2 sm:px-3 py-2 bg-gray-50 dark:bg-gray-600 text-gray-900 dark:text-gray-100 text-sm sm:text-base font-semibold"
					>
						<img
							v-if="matches[0]?.competition?.emblem"
							:src="matches[0].competition.emblem"
							:alt="matches[0]?.competition?.name"
							class="h-4 w-4 sm:h-5 sm:w-5 object-contain"
						/>
						<span class="truncate">{{ matches[0]?.competition?.name || 'Competition' }}</span>
					</div>

					<!-- Список матчей -->
					<ul class="divide-y divide-gray-200 dark:divide-gray-700">
						<li
							v-for="m in matches"
							:key="m.id"
							class="px-2 sm:px-3 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2 text-sm sm:text-base"
						>
							<div class="flex flex-wrap items-center gap-1 sm:gap-2">
								<span class="font-medium truncate max-w-[120px] sm:max-w-none">{{ m.homeTeam.name }}</span>
								<span class="opacity-70">vs</span>
								<span class="font-medium truncate max-w-[120px] sm:max-w-none">{{ m.awayTeam.name }}</span>
								<span
									v-if="m.stage"
									class="ml-0 sm:ml-2 text-[5px] sm:text-xxs px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
								>
									{{ m.stage }}
								</span>
							</div>
							<div
								class="text-xs sm:text-sm"
								:class="tab === 'live' ? 'text-red-500 font-semibold' : 'text-gray-600 dark:text-gray-400'"
							>
								{{
									tab === 'live'
										? (m.score?.fullTime?.home ?? 0) + ' : ' + (m.score?.fullTime?.away ?? 0)
										: formatDate(m.utcDate)
								}}
							</div>
						</li>
					</ul>
				</div>
			</div>

			<div v-else class="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
				No {{ tab === 'upcoming' ? 'upcoming' : 'live' }} matches
			</div>
		</div>

		<!-- ScoreBat iframe -->
		<div class="bg-white dark:bg-surface rounded-lg shadow p-2 sm:p-4">
			<h2 class="text-base sm:text-lg font-semibold mb-2">ScoreBat Live</h2>
			<iframe
				src="https://www.scorebat.com/embed/livescore/"
				frameborder="0"
				width="100%"
				height="350"
				class="sm:h-[500px] rounded-md"
				allowfullscreen
			></iframe>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api'

interface Match {
	id: number
	utcDate: string
	stage?: string
	homeTeam: { name: string }
	awayTeam: { name: string }
	competition: { id: number; name: string }
	score?: { fullTime?: { home: number; away: number } }
}

const matches = ref<Match[]>([])
const lastUpdated = ref('')
const tab = ref<'upcoming' | 'live'>('upcoming')
const loading = ref(false)
const error = ref('')

const groupedMatches = computed<Record<string, Match[]>>(() => {
	const map: Record<string, Match[]> = {}
	for (const m of matches.value) {
		const key = String(m.competition?.id ?? 'unknown')
		if (!map[key]) map[key] = []
		map[key].push(m)
	}
	for (const key of Object.keys(map)) {
		map[key].sort((a, b) => +new Date(a.utcDate) - +new Date(b.utcDate))
	}
	return map
})

async function loadMatches() {
	loading.value = true
	error.value = ''
	try {
		const endpoint = tab.value === 'upcoming' ? `${API_BASE}/matches` : `${API_BASE}/matches/live`

		const res = await fetch(endpoint)
		if (!res.ok) throw new Error(`HTTP ${res.status}`)

		const data = await res.json()
		matches.value = data.matches || []
		lastUpdated.value = new Date().toLocaleTimeString('ru-RU')
	} catch (err: any) {
		console.error('Error loading matches:', err)
		error.value = err.message
		matches.value = []
	} finally {
		loading.value = false
	}
}

onMounted(() => {
	loadMatches()
	const t = setInterval(loadMatches, 60000)
	window.addEventListener('beforeunload', () => clearInterval(t))
})

watch(tab, loadMatches)

function formatDate(iso: string) {
	const d = new Date(iso)
	return d.toLocaleString('ru-RU', {
		day: '2-digit',
		month: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
	})
}
</script>

<style scoped>
:root {
	--surface-light: #ffffff;
	--surface-dark: oklch(0.71 0.04 257.34);
}
.bg-white {
	background-color: var(--surface-light);
}
html.dark .bg-surface {
	background-color: var(--surface-dark);
}
</style>
