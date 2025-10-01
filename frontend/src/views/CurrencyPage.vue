<template>
	<div
		class="currency-page max-w-4xl mx-auto p-0 space-y-10 
		       text-gray-900 dark:text-gray-100 
		       bg-white dark:bg-gray-900 
		       min-h-screen transition-all duration-300"
	>
		<!-- 🔄 Конвертер -->
		<section
			class="converter p-6 rounded-xl shadow-lg 
			       bg-white dark:bg-gray-500 
			       text-gray-900 dark:text-gray-100
			       transition-all duration-300"
		>
			<h2 class="text-2xl font-bold mb-4">Конвертер валют</h2>

			<div class="flex flex-col sm:flex-row gap-4 items-center animate-fade-in">
				<!-- ввод суммы -->
				<input
					:value="formattedAmount"
					@input="onAmountInput"
					inputmode="numeric"
					pattern="[0-9]*"
					class="border px-3 py-2 rounded-lg w-full sm:w-40 
					       bg-white dark:bg-gray-700 
					       text-gray-900 dark:text-gray-100
					       border-gray-300 dark:border-gray-600 
					       focus:ring-2 focus:ring-blue-500 transition"
					placeholder="0"
				/>

				<!-- выбор валюты из -->
				<select
					v-model="from"
					class="border px-3 py-2 rounded-lg w-full sm:w-40 
					       bg-white dark:bg-gray-700 
					       text-gray-900 dark:text-gray-100
					       border-gray-300 dark:border-gray-600 
					       focus:ring-2 focus:ring-blue-500 transition"
				>
					<optgroup label="Традиционные валюты">
						<option
							v-for="c in Object.keys(fiatRates)"
							:key="c"
							:value="c"
							class="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
						>
							{{ c }}
						</option>
					</optgroup>
					<optgroup label="Криптовалюты">
						<option
							v-for="c in Object.keys(cryptoRates)"
							:key="c"
							:value="c"
							class="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
						>
							{{ c }}
						</option>
					</optgroup>
				</select>

				<!-- кнопка обмена -->
				<button
					@click="swap"
					class="swap-btn transform transition hover:scale-110 
					       bg-blue-600 dark:bg-blue-500 text-white"
				>
					⇄
				</button>

				<!-- выбор валюты в -->
				<select
					v-model="to"
					class="border px-3 py-2 rounded-lg w-full sm:w-40 
					       bg-white dark:bg-gray-700 
					       text-gray-900 dark:text-gray-100
					       border-gray-300 dark:border-gray-600 
					       focus:ring-2 focus:ring-blue-500 transition"
				>
					<optgroup label="Традиционные валюты">
						<option
							v-for="c in Object.keys(fiatRates)"
							:key="c"
							:value="c"
							class="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
						>
							{{ c }}
						</option>
					</optgroup>
					<optgroup label="Криптовалюты">
						<option
							v-for="c in Object.keys(cryptoRates)"
							:key="c"
							:value="c"
							class="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
						>
							{{ c }}
						</option>
					</optgroup>
				</select>
			</div>

			<!-- результат -->
			<transition name="fade">
				<div
					v-if="converted"
					class="mt-6 text-xl font-semibold animate-bounce-in"
				>
					{{ formattedAmount }} {{ from }} =
					<span class="text-blue-600 dark:text-blue-400">{{ converted }}</span>
					{{ to }}
				</div>
			</transition>
		</section>

		<!-- 📈 График BTC -->
		<section
			class="p-4 rounded-xl shadow-lg 
			       bg-white dark:bg-gray-800 
			       text-gray-900 dark:text-gray-100
			       transition-all duration-300"
		>
			<h2 class="text-xl font-semibold mb-4">Курс BTC/RUB (15 дней)</h2>
			<canvas ref="btcChart" class="w-full h-56"></canvas>
		</section>

		<!-- 📊 Фиат -->
		<section>
			<h2 class="text-xl font-semibold mb-2">Традиционные валюты</h2>
			<ul class="space-y-2">
				<li
					v-for="code in Object.keys(fiatRates)"
					:key="code"
					class="flex justify-between border-b pb-1 relative cursor-pointer 
					       hover:bg-gray-50 dark:hover:bg-gray-700
					       text-gray-900 dark:text-gray-100
					       border-gray-200 dark:border-gray-600"
					@click="setCurrency(code)"
				>
					<span class="font-semibold flex items-center gap-2">{{ code }}</span>
					<span>{{ format(fiatRates[code]) }} ₽</span>
				</li>
			</ul>
		</section>

		<!-- ₿ Крипта -->
		<section>
			<h2 class="text-xl font-semibold mb-2">Криптовалюты</h2>
			<ul class="space-y-2">
				<li
					v-for="code in Object.keys(cryptoRates)"
					:key="code"
					class="flex justify-between border-b pb-1 relative cursor-pointer 
					       hover:bg-gray-50 dark:hover:bg-gray-700
					       text-gray-900 dark:text-gray-100
					       border-gray-200 dark:border-gray-600"
					@click="setCurrency(code)"
				>
					<span class="font-semibold flex items-center gap-2">{{ code }}</span>
					<span>{{ format(cryptoRates[code]) }} ₽</span>
				</li>
			</ul>
		</section>
	</div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import Chart from 'chart.js/auto'

// ✅ rates
const fiatRates = ref<Record<string, number>>({})
const cryptoRates = ref<Record<string, number>>({})
const btcChart = ref<HTMLCanvasElement | null>(null)

// --- список валют ---
const fiatCodes = ['RUB', 'USD', 'EUR', 'CNY', 'TRY', 'KZT', 'BYN', 'GBP', 'CHF', 'JPY']
const cryptoCodes = ['BTC', 'ETH', 'USDT']

import ruFlag from '../assets/flags/ru.svg'
import usFlag from '../assets/flags/us.svg'
import euFlag from '../assets/flags/eu.svg'
import cnFlag from '../assets/flags/cn.svg'
import trFlag from '../assets/flags/tr.svg'
import kzFlag from '../assets/flags/kz.svg'
import byFlag from '../assets/flags/by.svg'
import gbFlag from '../assets/flags/gb.svg'
import chFlag from '../assets/flags/ch.svg'
import jpFlag from '../assets/flags/jp.svg'

const flags: Record<string, string> = {
	RUB: ruFlag,
	USD: usFlag,
	EUR: euFlag,
	CNY: cnFlag,
	TRY: trFlag,
	KZT: kzFlag,
	BYN: byFlag,
	GBP: gbFlag,
	CHF: chFlag,
	JPY: jpFlag,
	BTC: '₿',
	ETH: '♦️',
	USDT: '💵',
}

const format = (num: number) =>
	new Intl.NumberFormat('ru-RU', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}).format(num)

function setCurrency(code: string) {
	if (!from.value) from.value = code
	else if (!to.value) to.value = code
	else from.value = code
}

// API ЦБ РФ
async function loadFiat() {
	try {
		const res = await fetch('https://www.cbr-xml-daily.ru/latest.js')
		const data = await res.json()
		const rates: Record<string, number> = { RUB: 1 }

		// Фильтруем валюты, которые есть в ответе API
		fiatCodes
			.filter(c => c !== 'RUB')
			.forEach(code => {
				if (data.rates?.[code]) {
					rates[code] = 1 / data.rates[code]
				}
			})

		// ✅ Добавляем KZT вручную, если его нет в API
		if (!rates.KZT) {
			rates.KZT = 0.15
		}

		fiatRates.value = rates
	} catch (err) {
		console.error('Ошибка загрузки фиатных валют:', err)
		fiatRates.value = {
			RUB: 1,
			USD: 90.0,
			EUR: 98.0,
			CNY: 12.5,
			TRY: 2.8,
			KZT: 0.15,
			BYN: 28.0,
			GBP: 114.0,
			CHF: 102.0,
			JPY: 0.6,
		}
	}
}

// API CoinGecko
async function loadCrypto() {
	try {
		const res = await fetch(
			'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether&vs_currencies=rub'
		)
		const data = await res.json()
		cryptoRates.value = {
			BTC: Number(data.bitcoin?.rub ?? 0),
			ETH: Number(data.ethereum?.rub ?? 0),
			USDT: Number(data.tether?.rub ?? 0),
		}
	} catch (err) {
		console.error('Ошибка загрузки криптовалют:', err)
		cryptoRates.value = {
			BTC: 3500000,
			ETH: 250000,
			USDT: 90,
		}
	}
}

// 📈 График BTC/RUB
async function loadBtcChart() {
	try {
		const res = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=rub&days=15')
		const data = await res.json()

		const labels = data.prices.map((p: any) =>
			new Date(p[0]).toLocaleDateString('ru-RU', {
				day: '2-digit',
			})
		)
		const prices = data.prices.map((p: any) => p[1])

		const dayMap: Record<string, number[]> = {}
		labels.forEach((date, i) => {
			if (!dayMap[date]) dayMap[date] = []
			dayMap[date].push(prices[i])
		})

		const finalLabels = Object.keys(dayMap)
		const finalPrices = finalLabels.map(day => dayMap[day].reduce((a, b) => a + b, 0) / dayMap[day].length)

		if (btcChart.value) {
			const ctx = btcChart.value.getContext('2d')
			if (!ctx) return

			// Определяем цвета для светлой и темной темы
			const isDark = document.documentElement.classList.contains('dark')
			const textColor = isDark ? '#f3f4f6' : '#374151'
			const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
			const tooltipBg = isDark ? '#1f2937' : '#1e293b'

			const gradient = ctx.createLinearGradient(0, 0, 0, 400)
			gradient.addColorStop(0, isDark ? 'rgba(59,130,246,0.4)' : 'rgba(37,99,235,0.4)')
			gradient.addColorStop(1, isDark ? 'rgba(59,130,246,0)' : 'rgba(37,99,235,0)')

			new Chart(ctx, {
				type: 'line',
				data: {
					labels: finalLabels,
					datasets: [
						{
							label: 'BTC/RUB',
							data: finalPrices,
							borderColor: isDark ? '#3b82f6' : '#2563eb',
							backgroundColor: gradient,
							tension: 0.4,
							pointRadius: 3,
							pointHoverRadius: 6,
							pointBackgroundColor: isDark ? '#3b82f6' : '#2563eb',
							fill: true,
						},
					],
				},
				options: {
					responsive: true,
					plugins: {
						legend: { display: false },
						tooltip: {
							backgroundColor: tooltipBg,
							titleColor: '#fff',
							bodyColor: '#e2e8f0',
							displayColors: false,
							callbacks: {
								label: ctx =>
									new Intl.NumberFormat('ru-RU', {
										style: 'currency',
										currency: 'RUB',
										maximumFractionDigits: 0,
									}).format(ctx.raw as number),
							},
						},
					},
					scales: {
						x: {
							grid: { 
								display: false,
								color: gridColor 
							},
							ticks: {
								autoSkip: false,
								maxRotation: 0,
								color: textColor,
							},
						},
						y: {
							grid: { 
								color: gridColor 
							},
							ticks: {
								color: textColor,
								callback: value =>
									new Intl.NumberFormat('ru-RU', {
										notation: 'compact',
										maximumFractionDigits: 1,
									}).format(value as number),
							},
						},
					},
					animation: {
						duration: 1000,
						easing: 'easeOutQuart',
					},
				},
			})
		}
	} catch (err) {
		console.error('Ошибка загрузки графика BTC:', err)
	}
}

const amount = ref<number>(0)

const formattedAmount = computed(() => new Intl.NumberFormat('ru-RU').format(amount.value))

function onAmountInput(e: Event) {
	const raw = (e.target as HTMLInputElement).value
	const numeric = raw.replace(/\D/g, '')
	amount.value = Number(numeric || 0)
}

// --- Конвертер ---
const from = ref(localStorage.getItem('conv_from') || 'USD')
const to = ref(localStorage.getItem('conv_to') || 'RUB')

const rates = ref<Record<string, number>>({})

function swap() {
	const tmp = from.value
	from.value = to.value
	to.value = tmp
}

async function loadRates() {
	await loadFiat()
	await loadCrypto()
	rates.value = { ...fiatRates.value, ...cryptoRates.value }
}

const converted = computed(() => {
	const rateFrom = rates.value[from.value]
	const rateTo = rates.value[to.value]
	if (!rateFrom || !rateTo) return null
	return new Intl.NumberFormat('ru-RU', {
		maximumFractionDigits: 2,
	}).format((amount.value * rateFrom) / rateTo)
})

onMounted(() => {
	loadRates()
	loadBtcChart()
})

watch([from, to], () => {
	localStorage.setItem('conv_from', from.value)
	localStorage.setItem('conv_to', to.value)
})
</script>

<style scoped>
.swap-btn {
	padding: 0.6rem 0.9rem;
	border-radius: 50%;
	font-size: 1.2rem;
	border: none;
	cursor: pointer;
	transition: background 0.3s;
}

.swap-btn:hover {
	background: #1d4ed8;
}

.dark .swap-btn {
	background: #3b82f6;
}
.dark .swap-btn:hover {
	background: #2563eb;
}

/* анимации */
.fade-enter-active,
.fade-leave-active {
	transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
	transform: translateY(-5px);
}

@keyframes bounce-in {
	0% {
		transform: scale(0.9);
		opacity: 0;
	}
	70% {
		transform: scale(1.05);
		opacity: 1;
	}
	100% {
		transform: scale(1);
	}
}
.animate-bounce-in {
	animation: bounce-in 0.4s ease;
}
.animate-fade-in {
	animation: fadeIn 0.5s ease;
}
@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(5px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}
</style>