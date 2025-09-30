<template>
  <div
    :id="`scoreaxis-widget-${inst}`"
    class="scoreaxis-widget relative rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-surface p-2"
  >
    <!-- Лоадер -->
    <div
      v-if="loading"
      class="absolute inset-0 flex items-center justify-center bg-white dark:bg-surface z-10"
    >
      <div class="loader"></div>
    </div>

    <!-- iframe -->
    <iframe
      :src="`https://www.scoreaxis.com/widget/standings-widget/${leagueId}?autoHeight=1&inst=${inst}`"
      style="width:100%;border:none;transition:all 300ms ease"
      @load="loading = false"
    ></iframe>
  </div>

  <div class="mt-1 text-xs text-gray-500 dark:text-gray-400">
    Data provided by
    <a target="_blank" href="https://www.scoreaxis.com/" class="underline hover:text-blue-500">
      Scoreaxis
    </a>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

interface Props {
  leagueId: number
  inst: string
}

const props = defineProps<Props>()
const loading = ref(true)

onMounted(() => {
  window.addEventListener(
    'message',
    event => {
      if (event.data.appHeight && event.data.inst === props.inst) {
        const container = document.querySelector<HTMLIFrameElement>(
          `#scoreaxis-widget-${props.inst} iframe`
        )
        if (container) {
          container.style.height = parseInt(event.data.appHeight) + 'px'
        }
      }
    },
    false
  )
})
</script>

<style scoped>
/* Loader */
.loader {
  width: 32px;
  height: 32px;
  border: 4px solid #ccc;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* iframe всегда на всю ширину */
.scoreaxis-widget iframe {
  width: 100% !important;
  min-height: 400px;
}
@media (max-width: 768px) {
  .scoreaxis-widget iframe {
    min-height: 500px;
  }
}
</style>
