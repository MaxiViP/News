<template>
	<div class="currency-page max-w-4xl mx-auto p-6 space-y-10">
		<!-- 🔄 Конвертер -->
		<section class="converter p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800 transition-all duration-300">
			<h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">Конвертер валют</h2>

			<div class="flex flex-col sm:flex-row gap-4 items-center animate-fade-in">
				<!-- ввод суммы -->
				<input
					v-model.number="amount"
					type="number"
					min="0"
					class="border px-3 py-2 rounded-lg w-full sm:w-40 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 transition"
				/>

				<!-- выбор валюты из -->
				<select v-model="from" class="border px-3 py-2 rounded-lg w-full sm:w-40 dark:bg-gray-700 dark:text-white">
					<optgroup label="Традиционные валюты">
						<option v-for="c in Object.keys(fiatRates)" :key="c" :value="c">
							<span class="flex items-center gap-2">
								<template v-if="flags[c]?.startsWith('data:image/svg')">
									<img :src="flags[c]" alt="" class="w-5 h-5 inline-block" />
								</template>
								<template v-else>{{ flags[c] }}</template>
								{{ c }}
							</span>
						</option>
					</optgroup>
					<optgroup label="Криптовалюты">
						<option v-for="c in Object.keys(cryptoRates)" :key="c" :value="c">
							<span class="flex items-center gap-2">
								<template v-if="flags[c]?.startsWith('data:image/svg')">
									<img :src="flags[c]" alt="" class="w-5 h-5 inline-block" />
								</template>
								<template v-else>{{ flags[c] }}</template>
								{{ c }}
							</span>
						</option>
					</optgroup>
				</select>

				<!-- кнопка обмена -->
				<button @click="swap" class="swap-btn transform transition hover:scale-110">⇄</button>

				<!-- выбор валюты в -->
				<select v-model="to" class="border px-3 py-2 rounded-lg w-full sm:w-40 dark:bg-gray-700 dark:text-white">
					<optgroup label="Традиционные валюты">
						<option v-for="c in Object.keys(fiatRates)" :key="c" :value="c">
							<span class="flex items-center gap-2">
								<template v-if="flags[c]?.startsWith('data:image/svg')">
									<img :src="flags[c]" alt="" class="w-5 h-5 inline-block" />
								</template>
								<template v-else>{{ flags[c] }}</template>
								{{ c }}
							</span>
						</option>
					</optgroup>
					<optgroup label="Криптовалюты">
						<option v-for="c in Object.keys(cryptoRates)" :key="c" :value="c">
							<span class="flex items-center gap-2">
								<template v-if="flags[c]?.startsWith('data:image/svg')">
									<img :src="flags[c]" alt="" class="w-5 h-5 inline-block" />
								</template>
								<template v-else>{{ flags[c] }}</template>
								{{ c }}
							</span>
						</option>
					</optgroup>
				</select>
			</div>

			<!-- результат -->
			<transition name="fade">
				<div v-if="converted" class="mt-6 text-xl font-semibold text-gray-900 dark:text-gray-100 animate-bounce-in">
					{{ amount }} {{ from }} =
					<span class="text-blue-600 dark:text-blue-400">{{ converted }}</span>
					{{ to }}
				</div>
			</transition>
		</section>

		<!-- 📈 График BTC -->
		<section class="p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800 transition-all duration-300">
			<h2 class="text-xl font-semibold mb-4">Курс BTC/RUB (30 дней)</h2>
			<canvas ref="btcChart" class="w-full h-64"></canvas>
		</section>

		<!-- 📊 Фиат -->
		<section>
			<h2 class="text-xl font-semibold mb-2">Традиционные валюты</h2>
			<ul class="space-y-2">
				<li
					v-for="code in Object.keys(fiatRates)"
					:key="code"
					class="flex justify-between border-b pb-1 relative hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
					@click="setCurrency(code)"
				>
					<span class="font-semibold flex items-center gap-2">
						<template v-if="flags[code]">
							<img :src="flags[code]" alt="" class="w-5 h-5 inline-block" />
						</template>

						<template v-else>{{ flags[code] }}</template>
						{{ code }}
					</span>
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
					class="flex justify-between border-b pb-1 relative hover:bg-gray-50 dark:hover:bg-gray-700 transition cursor-pointer"
					@click="setCurrency(code)"
				>
					<span class="font-semibold flex items-center gap-2">
						<template v-if="flags[code]?.startsWith('data:image/svg')">
							<img :src="flags[code]" alt="" class="w-5 h-5 inline-block" />
						</template>
						<template v-else>{{ flags[code] }}</template>
						{{ code }}
					</span>
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
	KZT: kzFlag, // ✅ Теперь KZT использует SVG флаг
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
			// Примерный курс KZT/RUB (можно заменить на актуальный)
			rates.KZT = 0.15 // 1 KZT = 0.15 RUB
		}

		fiatRates.value = rates
	} catch (err) {
		console.error('Ошибка загрузки фиатных валют:', err)
		// ✅ На случай ошибки API добавляем базовые курсы
		fiatRates.value = {
			RUB: 1,
			USD: 90.0,
			EUR: 98.0,
			CNY: 12.5,
			TRY: 2.8,
			KZT: 0.15, // ✅ KZT всегда будет в списке
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
		// На случай ошибки API добавляем базовые курсы
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
		const res = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=rub&days=30')
		const data = await res.json()
		const labels = data.prices.map((p: any) => new Date(p[0]).toLocaleDateString('ru-RU'))
		const prices = data.prices.map((p: any) => p[1])

		if (btcChart.value) {
			new Chart(btcChart.value, {
				type: 'line',
				data: {
					labels,
					datasets: [
						{
							label: 'BTC/RUB',
							data: prices,
							borderColor: '#2563eb',
							backgroundColor: 'rgba(37,99,235,0.3)',
							tension: 0.2,
							fill: true,
						},
					],
				},
				options: {
					responsive: true,
					plugins: { legend: { display: false } },
				},
			})
		}
	} catch (err) {
		console.error('Ошибка загрузки графика BTC:', err)
	}
}

// --- Конвертер ---
const amount = ref(1)
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
	background: #2563eb;
	color: white;
	padding: 0.6rem 0.9rem;
	border-radius: 50%;
	font-size: 1.2rem;
}
.swap-btn:hover {
	background: #1d4ed8;
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
