<template>
	<RouterLink to="/currency" class="currency-rates flex flex-col gap-1 text-sm transition-colors duration-300">
		<!-- <span class="hidden sm:inline">Конвертер валют</span> -->
		<span v-if="rates" class="flex items-center gap-1">
			<span class="hidden sm:inline">💵 USD:</span>
			<span class="font-semibold dark:text-green-700"> {{ rates.USD?.toFixed(1) }} ₽ </span>
		</span>
		<span v-if="rates" class="flex items-center gap-1">
			<span class="hidden sm:inline">💶 EUR:</span>
			<span class="font-semibold dark:text-blue-400"> {{ rates.EUR?.toFixed(1) }} ₽ </span>
		</span>
		<span v-else class="text-gray-600 dark:text-gray-400">Загрузка...</span>
	</RouterLink>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const rates = ref<{ USD?: number; EUR?: number }>({})

async function loadRates() {
	try {
		const res = await fetch('https://open.er-api.com/v6/latest/RUB')
		const data = await res.json()
		rates.value = {
			USD: 1 / data.rates.USD,
			EUR: 1 / data.rates.EUR,
		}
	} catch (e) {
		console.error('Ошибка загрузки курсов:', e)
	}
}

onMounted(loadRates)
</script>

<style scoped>
.currency-rates {
	line-height: 1.4;
	padding: 0.5rem 1rem;
	border: 1px solid #e5e7eb;;
	border-radius: 12px;
}
</style>
