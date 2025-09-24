<template>
  <CategoryTabs />
  <!-- сетка карточек -->
  <section class="grid-fix">
    <ArticleCard v-for="a in news.items" :key="a.id" :a="a" />
  </section>

  <!-- скелетоны той же сеткой -->
  <section v-if="news.loading" class="grid-fix" style="margin-top:8px">
    <div v-for="n in 6" :key="n" class="skeleton-card">
      <div class="skeleton-img"></div>
      <div class="skeleton-line" style="width:75%"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line" style="width:86%"></div>
    </div>
  </section>
  

  <div class="center">
    <button v-if="news.hasMore && !news.loading" @click="news.load()" class="more">Загрузить ещё</button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@vueuse/head'
import { useNews } from '../stores/news'
import ArticleCard from '../components/ArticleCard.vue'
import CategoryTabs from '../components/CategoryTabs.vue'

const route = useRoute()
const news = useNews()
const category = route.params.category as string

useHead({
  title: `Новости ${category} — News and News`,
  meta: [
    {
      name: 'description',
      content: `Читайте последние новости категории ${category} на News and News.`,
    },
  ],
})

async function loadCategory() {
  const cat = String(route.params.category || 'tech') as any
  news.setCategory(cat); await news.load(true)
}
onMounted(loadCategory)
watch(() => route.params.category, () => loadCategory())

let ticking = false
function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    if (!news.loading && news.hasMore &&
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 800) {
      news.load()
    }
    ticking = false
  })
}
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
/* сетка без Tailwind */
.grid-fix {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(1, minmax(0, 1fr));
}
@media (min-width: 640px) {
  .grid-fix { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (min-width: 1024px) {
  .grid-fix { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
.center { display:flex; justify-content:center; padding: 20px 0; }
.more {
  border:1px solid #e5e7eb; background:#fff; border-radius:12px; padding:8px 14px; cursor:pointer;
}

/* скелетоны */
.skeleton-card {
  border:1px solid #e5e7eb; border-radius:20px; background:#fff; padding:12px;
  box-shadow: 0 6px 20px -12px rgba(0,0,0,.15);
}
.skeleton-img { height:180px; background: #eee; border-radius:12px; margin-bottom:10px; }
.skeleton-line { height:12px; background:#eee; border-radius:8px; margin:8px 0; }
</style>
