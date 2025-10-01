<template>
	<div class="relative weather-block">
		<!-- 🔘 кнопка -->
		<button
			@click="toggleOpen"
			class="time-btn flex flex-col items-center rounded-lg font-bold transition text-xs sm:text-sm"
			:class="[
				open
					? 'bg-blue-600 text-white'
					: 'bg-white text-gray-900 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700',
			]"
		>
			<span class="time">{{ formattedTime }}</span>
			<span class="date font-normal text-[10px] opacity-80">{{ formattedDate }}</span>
		</button>

		<!-- 📦 выпадающая панель -->
		<transition name="fade">
			<div
				v-if="open"
				class="dropdown absolute right-0 mt-2 p-3 rounded-lg shadow-lg border w-64 z-50"
				:class="['bg-white border-gray-200 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200']"
			>
				<!-- 📅 дата (на мобилках показываем здесь) -->
				<div class="block md:hidden text-xs text-gray-500 dark:text-gray-400 mb-2">📅 {{ formattedDate }}</div>

				<!-- 📍 город -->
				<div class="text-xs text-gray-500 dark:text-gray-400 mb-2">🌍 {{ city }}</div>

				<!-- 🌤 основная погода -->
				<div v-if="weather" class="flex items-center gap-3 mb-3">
					<img v-if="weather.icon" :src="weather.icon" alt="icon" class="w-10 h-10 object-contain" />
					<div class="flex flex-col">
						<span class="temp text-lg font-bold text-red-600 dark:text-red-400">
							{{ weather.temp }}°C
							<span class="text-xs font-normal text-gray-600 dark:text-gray-400">
								(ощущается {{ weather.feels }}°C)
							</span>
						</span>
						<span class="desc text-sm text-gray-600 dark:text-gray-400">{{ weather.desc }}</span>
					</div>
				</div>

				<!-- 📊 доп. инфа -->
				<div class="grid grid-cols-2 gap-0.5 text-xs text-gray-600 dark:text-gray-400">
					<div>💧 Вл.: {{ weather.humidity }}%</div>
					<div>💨 Ветер: {{ weather.wind }} км/ч</div>
					<div>🔽 Давл.: {{ weather.pressure }} мм</div>
					<div>🌅 Вос.: {{ weather.sunrise }}</div>
					<div>🌇 Зак.: {{ weather.sunset }}</div>
					<div>🌙 Фаза: {{ weather.moon }}</div>
				</div>
			</div>
		</transition>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const open = ref(false)
const weather = ref<{
	temp: string
	feels: string
	desc: string
	icon: string
	humidity: string
	wind: string
	pressure: string
	sunrise: string
	sunset: string
	moon: string
} | null>(null)

const city = ref('Москва')
const formattedDate = ref('')
const formattedTime = ref('')

function updateTime() {
	const now = new Date()

	formattedDate.value = now.toLocaleDateString('ru-RU', {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
	})

	// ✅ Проверяем ширину экрана — если ≤600px, показываем только чч:мм
	if (window.innerWidth <= 600) {
		formattedTime.value = now.toLocaleTimeString('ru-RU', {
			hour: '2-digit',
			minute: '2-digit',
		})
	} else {
		formattedTime.value = now.toLocaleTimeString('ru-RU', {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
		})
	}
}

async function loadWeather() {
	try {
		const locRes = await fetch('https://ipapi.co/json/')
		const loc = await locRes.json()
		city.value = loc.city || 'Москва'

		const res = await fetch(`https://wttr.in/${city.value}?format=j1`)
		const data = await res.json()
		const current = data.current_condition[0]
		const astronomy = data.weather[0]?.astronomy?.[0] || {}

		let icon = current.weatherIconUrl?.[0]?.value || ''
		if (icon.startsWith('http://')) {
			icon = icon.replace('http://', 'https://')
		}

		const pressureMm = Math.round(Number(current.pressure) * 0.75006)

		weather.value = {
			temp: current.temp_C,
			feels: current.FeelsLikeC,
			desc: current.weatherDesc[0].value,
			icon,
			humidity: current.humidity,
			wind: current.windspeedKmph,
			pressure: String(pressureMm),
			sunrise: astronomy.sunrise,
			sunset: astronomy.sunset,
			moon: astronomy.moon_phase,
		}
	} catch (e) {
		console.error('Ошибка погоды', e)
	}
}

function toggleOpen() {
	open.value = !open.value
}

onMounted(() => {
	updateTime()
	setInterval(updateTime, 1000)
	loadWeather()
	setInterval(loadWeather, 600_000)
})
</script>

<style scoped>
.time-btn {
	padding: 0.2rem 0.5rem;
	line-height: 1.2;
}

.time {
	font-size: 0.9rem;
}

.date {
	font-size: 0.7rem;
}

.dropdown {
	animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(-5px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.fade-enter-active,
.fade-leave-active {
	transition: all 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
	transform: translateY(-5px);
}

/* 📱 Адаптив */
@media (max-width: 768px) {
	.time-btn {
		font-size: 0.75rem;
		padding: 8px 6px;
	}
	.time-btn .date {
		display: none; /* ❌ скрываем дату */
	}

	.dropdown {
		left: 0;
		right: auto;
		max-width: none;
	}
}
</style>
