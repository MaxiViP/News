<template>
	<div class="p-6 space-y-6">
		<h1 class="text-2xl font-bold text-gray-900 dark:text-white">📺 Football Widgets</h1>

		<!-- Matches -->
		<div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
			<!-- Tabs -->
			<div class="flex gap-4 mb-4">
				<button
					@click="tab = 'upcoming'"
					:class="[
						'px-4 py-2 rounded-lg transition-all',
						tab === 'upcoming'
							? 'bg-blue-600 text-white shadow-lg'
							: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600',
					]"
				>
					⚽ Upcoming
				</button>
				<button
					@click="tab = 'live'"
					:class="[
						'px-4 py-2 rounded-lg transition-all',
						tab === 'live'
							? 'bg-red-600 text-white shadow-lg'
							: 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600',
					]"
				>
					🔴 Live
				</button>
			</div>

			<!-- Header -->
			<div class="flex items-center justify-between mb-2">
				<h2 class="text-lg font-semibold">
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
					class="rounded border border-gray-200 dark:border-gray-700"
				>
					<!-- Заголовок турнира -->
					<div class="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700/50 font-semibold">
						<img
							v-if="matches[0]?.competition?.emblem"
							:src="matches[0].competition.emblem"
							:alt="matches[0]?.competition?.name"
							class="h-5 w-5 object-contain"
						/>
						<span>{{ matches[0]?.competition?.name || 'Competition' }}</span>
					</div>

					<!-- Список матчей -->
					<ul class="divide-y divide-gray-200 dark:divide-gray-700">
						<li v-for="m in matches" :key="m.id" class="px-3 py-2 flex items-center justify-between">
							<div class="flex items-center gap-2">
								<span class="font-medium">{{ m.homeTeam.name }}</span>
								<span class="opacity-70">vs</span>
								<span class="font-medium">{{ m.awayTeam.name }}</span>
								<span
									v-if="m.stage"
									class="ml-2 text-xs px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
								>
									{{ m.stage }}
								</span>
							</div>
							<div
								class="text-sm"
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

			<div v-else class="text-gray-500 dark:text-gray-400">
				No {{ tab === 'upcoming' ? 'upcoming' : 'live' }} matches
			</div>
		</div>

		<!-- ScoreBat iframe -->
		<div class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
			<h2 class="text-lg font-semibold mb-2">ScoreBat Live</h2>
			<iframe
				src="https://www.scorebat.com/embed/livescore/"
				frameborder="0"
				width="100%"
				height="500"
				allowfullscreen
			></iframe>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

// ⚡ baseURL из env или по умолчанию
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

// 🔗 группировка по турнирам
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
	const t = setInterval(loadMatches, 60000) // ⏱️ обновляем раз в минуту
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
