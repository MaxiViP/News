<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useNews } from '../stores/news'
import ArticleCard from '../components/ArticleCard.vue'
import CategoryTabs from '../components/CategoryTabs.vue'

const route = useRoute()
const news = useNews()

function loadCategory() {
  const cat = String(route.params.category || 'tech') as any
  news.setCategory(cat)
  news.load(true)
}
onMounted(loadCategory)
watch(() => route.params.category, () => loadCategory())

function onScroll() {
  if (news.loading || !news.hasMore) return
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 800) {
    news.load()
  }
}
window.addEventListener('scroll', onScroll)
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <CategoryTabs />

<TransitionGroup
  name="cards"
  tag="section"
  class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
>
  <ArticleCard v-for="a in news.items" :key="a.id" :a="a" />
</TransitionGroup>


  <!-- скелетоны -->
  <section v-if="news.loading" class="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <div v-for="n in 6" :key="n" class="rounded-3xl border border-slate-200 bg-white/80 p-0 shadow-soft dark:border-slate-700 dark:bg-slate-800/60">
      <div class="h-44 w-full skeleton"></div>
      <div class="space-y-2 p-4">
        <div class="h-5 w-3/4 skeleton rounded-md"></div>
        <div class="h-4 w-full skeleton rounded-md"></div>
        <div class="h-4 w-5/6 skeleton rounded-md"></div>
      </div>
    </div>
  </section>

  <div class="flex items-center justify-center py-6">
    <button v-if="news.hasMore && !news.loading"
            @click="news.load()"
            class="rounded-xl border border-slate-200 bg-white/70 px-4 py-2 text-sm font-medium shadow-sm
                   hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 transition
                   dark:border-slate-700 dark:bg-slate-800/70">
      Загрузить ещё
    </button>
  </div>
</template>

<style scoped>
/* надёжная сетка без Tailwind — fallback */
.grid-fallback {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

/* если используешь TransitionGroup с class="grid grid-cols-1 ..." — добавь ещё этот класс на тот же тег */
@media (min-width: 640px) {
  .grid-fallback { gap: 18px; }
}
@media (min-width: 1024px) {
  .grid-fallback { gap: 20px; }
}

/* выравниваем высоту превьюшек */
.card-fallback .media {
  height: 180px;
  overflow: hidden;
}
.card-fallback .media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>

