<template>
	<div class="p-6 space-y-6">
		<h1 class="text-2xl font-bold text-gray-900 dark:text-white">📊 League Tables</h1>

		<!-- Селектор: национальные чемпионаты -->
		<h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">🏟 Domestic Leagues</h2>
		<div class="flex flex-wrap gap-2 mb-6">
			<button
				v-for="league in domesticLeagues"
				:key="league.id"
				@click="activeLeague = league.id"
				:class="[buttonClasses, activeLeague === league.id ? activeClasses : inactiveClasses]"
			>
				{{ league.name }}
			</button>
		</div>

		<!-- Селектор: еврокубки -->
		<h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">🌍 European Cups</h2>
		<div class="flex flex-wrap gap-2 mb-6">
			<button
				v-for="league in europeanCups"
				:key="league.id"
				@click="activeLeague = league.id"
				:class="[buttonClasses, activeLeague === league.id ? activeClasses : inactiveClasses]"
			>
				{{ league.name }}
			</button>
		</div>

		<!-- Виджет -->
		<ScoreaxisWidget :leagueId="activeLeague" :inst="instId" />
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ScoreaxisWidget from '../components/ScoreaxisWidget.vue'

const buttonClasses = 'px-4 py-2 rounded-lg transition-all'
const activeClasses = 'bg-blue-600 text-white shadow-lg'
const inactiveClasses = 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'

// 🏟 Национальные чемпионаты
const domesticLeagues = [
	{ id: 486, name: 'Премьер-лига (Россия)' },
	{ id: 492, name: 'Кубок России' },
	{ id: 8, name: 'Premier League (England)' },
	{ id: 564, name: 'La Liga (Spain)' },
	{ id: 384, name: 'Serie A (Italy)' },
	{ id: 82, name: 'Bundesliga (Germany)' },
	{ id: 301, name: 'Ligue 1 (France)' },
	{ id: 779, name: 'MLS (USA)' },
	{ id: 648, name: 'Brazil Serie A' },
	{ id: 72, name: 'Eredivisie (Netherlands)' },
	{ id: 462, name: 'Primeira Liga (Portugal)' },
	{ id: 600, name: 'Turkish Super Lig' },
]

// 🌍 Еврокубки
const europeanCups = [
	{ id: 2, name: 'Champions League' },
	{ id: 5, name: 'Europa League' },
  { id: 1538, name: 'Лига наций УЕФА' },
  { id: 720, name: 'WC Qualification Europe' },
]

const activeLeague = ref(8) // по умолчанию Premier League
const instId = 'vue-league-widget' // уникальный id
</script>
