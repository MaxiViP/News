<script setup lang="ts">
import { ref } from 'vue'
import { useNews } from '../stores/news'

const q = ref('')
const news = useNews()

async function search() {
  // если новости ещё не загружены
  if (!news.allItems.length) {
    await news.load(true)
  }
  news.search(q.value)
}
</script>

<template>
  <div>

    <div style="margin-top: 12px">
      <div v-for="a in news.items" :key="a.id" class="mb-4">
        <article
          class="rounded-2xl border border-gray-200 dark:border-gray-700 
                 bg-white dark:bg-gray-800 text-black dark:text-white 
                 shadow-md hover:shadow-lg 
                 transition-transform duration-150 ease-in-out hover:-translate-y-1 p-4"
        >
          <h3 class="font-semibold text-lg">{{ a.title }}</h3>
          <p class="text-sm text-gray-600 dark:text-gray-300">{{ a.summary }}</p>
        </article>
      </div>
    </div>
  </div>
</template>
