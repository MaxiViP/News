<template>
  <a :href="a.url" target="_blank" rel="noopener" class="block no-underline">
    <article class="card rounded-2xl shadow-md hover:shadow-lg transition-transform duration-150 ease-in-out hover:-translate-y-1">
      <!-- картинка -->
      <div class="relative h-48 overflow-hidden rounded-t-2xl">
        <img
          v-if="a.imageUrl"
          :src="a.imageUrl"
          :alt="a.title"
          loading="lazy"
          class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div v-else class="ph"></div>
      </div>

      <!-- текст -->
      <div class="p-4 flex flex-col gap-2">
        <h3 class="text-lg font-semibold line-clamp-2">
          {{ a.title }}
        </h3>
        <p v-if="a.summary" class="text-sm line-clamp-3">
          {{ a.summary }}
        </p>
        <div class="flex justify-between text-xs mt-2">
          <span class="truncate max-w-[70%]">{{ a.source?.name }}</span>
          <span>{{ new Date(a.publishedAt).toLocaleString() }}</span>
        </div>
      </div>
    </article>
  </a>
</template>

<script setup lang="ts">
defineProps<{ a: any }>()
</script>

<style>
.card .ph {
  width: 100%;
  height: 100%;
  background: #f3f4f6; /* gray-100 */
}

/* светлая тема по умолчанию */
.card {
  background: #fff;
  color: #000;
  border: 1px solid #e5e7eb;
}

/* тёмная тема включается при html.dark */
html.dark .card {
  background: #1f2937; /* gray-800 */
  color: #fff;
  border-color: #374151; /* gray-700 */
}
html.dark .card .ph {
  background: #374151; /* gray-700 */
}

.span {
  display: inline-flex;
}
</style>
