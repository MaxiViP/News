<template>
  <article v-reveal class="group rounded-3xl border border-slate-200 bg-white/80 shadow-soft overflow-hidden
                           transition hover:-translate-y-0.5 hover:shadow-glass dark:border-slate-700 dark:bg-slate-800/60">
    <div class="relative h-44 w-full overflow-hidden">
      <img v-if="a.imageUrl" :src="a.imageUrl" :alt="a.title"
           class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
      <div v-else class="h-full w-full skeleton rounded-none"></div>
      <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
    </div>

    <div class="flex flex-col gap-2 p-4">
      <h3 class="text-base font-semibold leading-snug line-clamp-2">
        <a :href="a.url" target="_blank" rel="noopener"
           class="underline decoration-transparent hover:decoration-brand-400 transition">
          {{ a.title }}
        </a>
      </h3>
      <p v-if="a.summary" class="text-sm text-slate-600 line-clamp-3 dark:text-slate-300">{{ a.summary }}</p>
      <div class="mt-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span class="truncate max-w-[70%]">{{ a.source?.name }}</span>
        <span>{{ new Date(a.publishedAt).toLocaleString() }}</span>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{ a: any }>()
</script>
