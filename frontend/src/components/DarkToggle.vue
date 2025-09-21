<template>
  <button @click="toggle" class="dark-toggle">
    <span v-if="isDark">🌙 Тёмная</span>
    <span v-else>🌞 Светлая</span>
  </button>
</template>

<script setup lang="ts">
import { useDark } from '../composables/useDark'

const { isDark, toggle } = useDark()
</script>

<style>
.dark-toggle {
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid var(--c-border, #ccc);
  background: var(--c-bg, #f9f9f9);
  color: inherit;
  transition: background 0.3s ease;
}
html.dark .dark-toggle {
  background: #333;
  color: #fff;
}
</style>

