<template>
	<nav class="mb-4 flex flex-wrap gap-2">
		<a
			v-for="c in cats"
			:key="c.key"
			:class="[
				'group relative rounded-full border px-3 py-1.5 text-sm transition-all',
				$route.params.category === c.key
					? 'border-brand-200 bg-brand-50 text-brand-700 dark:bg-brand-600/10 dark:text-brand-300'
					: 'border-slate-200 bg-white/70 text-slate-700 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300',
			]"
			href=""
			@click.prevent="$router.push(`/category/${c.key}`)"
		>
			{{ c.label }}
		</a>
	</nav>
</template>

<script setup lang="ts">
const cats = [
	{ key: 'news', label: 'Новости' },
	{ key: 'politics', label: 'Политика' },
	{ key: 'economy', label: 'Экономика' },
	{ key: 'science', label: 'Наука' },
	{ key: 'tech', label: 'Технологии' },
	{ key: 'sports', label: 'Спорт' },
	{ key: 'incidents', label: 'Происшествия' },
	{ key: 'auto', label: 'Авто' },
	{ key: 'esports', label: 'Киберспорт' },
]
</script>
