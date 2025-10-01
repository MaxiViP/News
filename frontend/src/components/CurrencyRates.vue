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
  line-height: 1;
  padding: 0.5rem 0.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  color: #111;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

/* 🌙 поддержка dark */
html.dark .currency-rates {
  background: #1f2937;
  border-color: #374151;
  color: #e5e7eb;
  box-shadow: 0 2px 6px rgba(0,0,0,0.4);
}

/* ✨ hover */
.currency-rates:hover {
  transform: translateY(-2px) scale(1.03);
  border-color: #3b82f6;
  box-shadow: 0 6px 14px rgba(59, 130, 246, 0.4);
}

/* 🔥 focus (для доступности) */
.currency-rates:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5), 0 8px 16px rgba(59, 130, 246, 0.6);
  transform: scale(1.04);
}

/* ⚡ active */
.currency-rates:active {
  transform: scale(0.97);
  border-color: #1e40af;
  box-shadow: 0 4px 8px rgba(30, 64, 175, 0.5);
}

</style>
