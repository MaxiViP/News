<template>
  <div class="currency-page max-w-3xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">Курсы валют к рублю</h1>

    <!-- Фиат -->
    <section class="mb-6">
      <h2 class="text-xl font-semibold mb-2">Традиционные валюты</h2>
      <ul class="space-y-2">
        <li
          v-for="(rate, code) in fiatRates"
          :key="code"
          class="flex justify-between border-b pb-1 relative"
        >
          <!-- код валюты с тултипом -->
          <span
            class="font-semibold cursor-pointer relative group"
            @click="toggleTooltip(code)"
          >
            {{ code }}
            <span
              v-if="activeTooltip === code"
              class="absolute left-0 top-6 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10"
            >
              {{ descriptions[code] || 'Неизвестная валюта' }}
            </span>
          </span>
          <span>{{ format(rate) }} ₽</span>
        </li>
      </ul>
    </section>

    <!-- Крипта -->
    <section>
      <h2 class="text-xl font-semibold mb-2">Криптовалюты</h2>
      <ul class="space-y-2">
        <li
          v-for="(rate, code) in cryptoRates"
          :key="code"
          class="flex justify-between border-b pb-1 relative"
        >
          <span
            class="font-semibold cursor-pointer relative group"
            @click="toggleTooltip(code)"
          >
            {{ code }}
            <span
              v-if="activeTooltip === code"
              class="absolute left-0 top-6 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10"
            >
              {{ descriptions[code] || 'Неизвестная валюта' }}
            </span>
          </span>
          <span>{{ format(rate) }} ₽</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const fiatRates = ref<Record<string, number>>({})
const cryptoRates = ref<Record<string, number>>({})
const activeTooltip = ref<string | null>(null)

const descriptions: Record<string, string> = {
  USD: 'Доллар США',
  EUR: 'Евро',
  CNY: 'Китайский юань',
  TRY: 'Турецкая лира',
  KZT: 'Казахстанский тенге',
  BYN: 'Белорусский рубль',
  BTC: 'Биткойн',
  ETH: 'Эфириум',
  USDT: 'Tether (стейблкоин)',
}

const format = (num: number) =>
  new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)

function toggleTooltip(code: string) {
  activeTooltip.value = activeTooltip.value === code ? null : code
}

// API ЦБ РФ
async function loadFiat() {
  try {
    const res = await fetch('https://www.cbr-xml-daily.ru/latest.js')
    const data = await res.json()
    const wanted = ['USD', 'EUR', 'CNY', 'TRY', 'KZT', 'BYN']
    const rates: Record<string, number> = {}
    wanted.forEach(code => {
      if (data.rates?.[code]) {
        rates[code] = 1 / data.rates[code]
      }
    })
    fiatRates.value = rates
  } catch (err) {
    console.error('Ошибка загрузки фиатных валют:', err)
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
  }
}

onMounted(() => {
  loadFiat()
  loadCrypto()
})
</script>
