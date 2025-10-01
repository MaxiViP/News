<template>
	<button @click="toggle" class="dark-toggle">
		<span v-if="isDark"
			>🌙
			<p class="p900">Тёмная</p></span
		>
		<span v-else
			>🌞
			<p class="p900">Светлая</p></span
		>
	</button>
</template>

<script setup lang="ts">
import { useDark } from '../composables/useDark'

const { isDark, toggle } = useDark()
</script>

<style>
	.p900 {
		display: none;
	}

.dark-toggle {
	cursor: pointer;
	padding: 6px 8px;
	margin-right: 10px;
	border-radius: 12px;
	border: 1px solid var(--c-border, #ccc);
	background: var(--c-bg, #f9f9f9);
	color: inherit;
	transition: background 0.3s ease;
}
html.dark .dark-toggle {
	background: #333;
	color: #fff;
}
@media (max-width: 900px) {
	.p900 {
		display: none;
	}
}
</style>
