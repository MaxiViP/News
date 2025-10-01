<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useNews } from '../stores/news'

const route = useRoute()
const news = useNews()
const q = ref<string>((route.params.q as string) || '')

async function runSearch() {
  if (!news.allItems.length) {
    await news.load(true)
  }
  news.search(q.value)
}

watch(
  () => route.params.q,
  (val) => {
    q.value = (val as string) || ''
    runSearch()
  },
  { immediate: true }
)

function shareArticle(a: any) {
  if (navigator.share) {
    navigator.share({
      title: a.title,
      text: a.summary,
      url: a.url,
    })
  } else {
    navigator.clipboard.writeText(a.url)
    alert('Ссылка скопирована!')
  }
}
</script>

<template>
  <div>
    <h2 class="text-xl font-semibold mb-4" v-if="q">Результаты по запросу: «{{ q }}»</h2>
    <p v-else class="text-gray-500">Введите запрос в поле поиска.</p>
    

    <div v-if="news.items.length === 0 && q" class="text-gray-500">
      Ничего не найдено.
    </div>

    <div v-for="a in news.items" :key="a.id ?? a.url ?? a.title" class="mb-4">
      <article
        class="card rounded-2xl shadow-md hover:shadow-lg transition-transform duration-150 ease-in-out hover:-translate-y-1"
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

          <div class="flex justify-between items-center text-xs mt-2">
            <span class="truncate max-w-[30%]">{{ a.source?.name }}</span>
            <div class="flex items-center gap-2">
              <span>{{ new Date(a.publishedAt).toLocaleString() }}</span>
              <!-- кнопка поделиться -->
              <button
                @click.prevent="shareArticle(a)"
                class="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-4 h-4"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M7.5 8.25h-2.25a2.25 2.25 0 00-2.25 2.25v9A2.25 2.25 0 005.25 22.5h9a2.25 2.25 0 002.25-2.25V18M15 3.75h5.25m0 0V9m0-5.25L10.5 14.25"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<style scoped>
.card .ph {
  width: 100%;
  height: 100%;
  background: #f3f4f6; /* gray-100 */
}
html.dark .card {
  background: #1f2937; /* gray-800 */
  color: #fff;
  border-color: #374151;
}
html.dark .card .ph {
  background: #374151; /* gray-700 */
}
</style>
