<template>
	<div class="px-6 space-y-6">
		<!-- Селектор: национальные чемпионаты -->
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
		<h2 class="text-lg font-semibold text-heading mb-2">🌍 European Cups</h2>
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
		<div class="scoreaxis-widget">
			<ScoreaxisWidget :leagueId="activeLeague" :inst="instId" :key="instId" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import ScoreaxisWidget from '../components/ScoreaxisWidget.vue'

const buttonClasses = 'px-4 py-2 rounded-lg transition-all'
const activeClasses = 'bg-blue-600 text-white shadow-lg'
const inactiveClasses =
	'bg-gray-200 dark:bg-surface-alt hover:bg-gray-300 dark:hover:bg-surface-hover'

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

// уникальный id для iframe
const instId = computed(() => `vue-league-widget-${activeLeague.value}`)

// 🔄 форсируем перерисовку на мобильных
watch(activeLeague, async () => {
	await nextTick()
})

// при монтировании тоже принудительно обновляем
onMounted(async () => {
	await nextTick()
})
</script>

<style scoped>
:root {
	--surface-alt-dark: oklch(0.68 0.04 257.34);
	--surface-hover-dark: oklch(0.63 0.05 257.34);

	--heading-light: #1f2937; /* gray-800 */
	--heading-dark: #e5e7eb; /* gray-200 */
}

.text-heading {
	color: var(--heading-light);
}

html.dark .text-heading {
	color: var(--heading-dark);
}

html.dark .dark\:bg-surface-alt {
	background-color: var(--surface-alt-dark) !important;
}

html.dark .dark\:hover\:bg-surface-hover:hover {
	background-color: var(--surface-hover-dark) !important;
}

/* Адаптивность для iframe Scoreaxis */
.scoreaxis-widget iframe {
	width: 100% !important;
	max-width: 100% !important;
	border: none;
	min-height: 600px; /* фикс пустоты */
}

@media (max-width: 768px) {
	.scoreaxis-widget iframe {
		width: 100% !important;
		min-height: 500px !important;
	}
}
</style>
