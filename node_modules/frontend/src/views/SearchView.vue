<script setup lang="ts">
import { ref } from 'vue'
import { useNews } from '../stores/news'
const q = ref('')
const news = useNews()
async function search() {
  news.filters.q = q.value
  news.page = 1
  await news.load(true)
}
</script>

<template>
  <div>
    <input v-model="q" placeholder="Поиск" @keyup.enter="search" />
    <button @click="search">Найти</button>
    <div style="margin-top:12px">
      <div v-for="a in news.items" :key="a.id">{{ a.title }}</div>
    </div>
  </div>
</template>
