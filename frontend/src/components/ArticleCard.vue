<template>
  <a
    :href="a.url"
    target="_blank"
    rel="noopener"
    class="block no-underline"
  >
    <article
      class="rounded-2xl border border-gray-200 dark:border-gray-700 
         bg-white dark:bg-gray-800 
         text-black dark:text-white
         shadow-md hover:shadow-lg 
         transition-transform duration-150 ease-in-out hover:-translate-y-1"
    >
      <!-- картинка -->
      <div class="relative h-48 overflow-hidden rounded-t-2xl">
        <img
          v-if="a.imageUrl"
          :src="a.imageUrl"
          :alt="a.title"
          loading="lazy"
          class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div
          v-else
          class="w-full h-full bg-gray-100 dark:bg-gray-700"
        ></div>
      </div>

      <!-- текст -->
      <div class="p-4 flex flex-col gap-2">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
          {{ a.title }}
        </h3>

        <p
          v-if="a.summary"
          class="text-sm text-gray-600 dark:text-gray-300 line-clamp-3"
        >
          {{ a.summary }}
        </p>

        <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
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
