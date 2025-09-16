<template>
  <article  class="card">
    <div class="media">
      <img v-if="a.imageUrl" :src="a.imageUrl" :alt="a.title" loading="lazy" />
      <div v-else class="ph"></div>
    </div>

    <div class="body" >
      <h3 class="title">
        <a :href="a.url" target="_blank" rel="noopener">{{ a.title }}</a>
      </h3>
      <p v-if="a.summary" class="summary">{{ a.summary }}</p>
      <div class="meta">
        <span class="src">{{ a.source?.name }}</span>
        <span>{{ new Date(a.publishedAt).toLocaleString() }}</span>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
defineProps<{ a: any }>()
</script>

<style scoped>
.card {
  border:1px solid #e5e7eb; border-radius:20px; background:#fff; overflow:hidden;
  box-shadow: 0 8px 22px -16px rgba(0,0,0,.2);
  transition: transform .15s ease, box-shadow .15s ease;
}
.card:hover { transform: translateY(-2px); box-shadow: 0 18px 38px -20px rgba(0,0,0,.25); }

.media { position:relative; height:180px; overflow:hidden; }
.media img { width:100%; height:100%; object-fit:cover; transition: transform .5s ease; }
.card:hover .media img { transform: scale(1.02); }
.media .ph { width:100%; height:100%; background:#eef2f7; }

.body { padding:14px; display:flex; flex-direction:column; gap:8px; }
.title { margin:0; font-size:16px; line-height:1.25; }
.title a { text-decoration: none; color:#111; }
.title a:hover { text-decoration: underline; text-decoration-color:#9ca3af; }
.summary { margin:0; color:#475569; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }
.meta { display:flex; justify-content:space-between; font-size:12px; color:#6b7280; }
.src { max-width:70%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
</style>
