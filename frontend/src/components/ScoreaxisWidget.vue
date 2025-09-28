<template>
  <div
    :id="`scoreaxis-widget-${inst}`"
    style="border:1px solid rgba(0,0,0,0.15);border-radius:8px;padding:10px;background:#fff;width:100%"
  >
    <iframe
      :src="`https://www.scoreaxis.com/widget/standings-widget/${leagueId}?autoHeight=1&inst=${inst}`"
      style="width:100%;border:none;transition:all 300ms ease"
    ></iframe>
  </div>
  <div style="font-size: 12px; font-family: Arial, sans-serif; text-align: left;">
    Data provided by <a target="_blank" href="https://www.scoreaxis.com/">Scoreaxis</a>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

interface Props {
  leagueId: number
  inst: string
}

const props = defineProps<Props>()

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
