<template>
  <div id="container">
    <header class="glass">
      <div class="bar">
        <h1>Новостной портал</h1>
        <form class="search" @submit.prevent="$router.push('/search/'+(q||''))">
          <input v-model="q" type="search" placeholder="Поиск по новостям..." />
          <button>Искать</button>
        </form>
      </div>
    </header>

    <router-view />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const q = ref('')
</script>

<style scoped>
/* центрируем и задаем максимальную ширину */
#container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 16px;
}

/* «стеклянная» шапка, если нет tailwind */
.glass {
  position: sticky; top: 12px; z-index: 50; margin-bottom: 24px;
  border: 1px solid rgba(0,0,0,.06);
  border-radius: 16px;
  background: rgba(255,255,255,.7);
  backdrop-filter: blur(6px);
  box-shadow: 0 10px 20px -12px rgba(0,0,0,.15);
}
.glass .bar { display:flex; gap:12px; align-items:center; padding:12px 16px; }
.glass h1 { margin:0; font-size:18px; font-weight:600; letter-spacing:-.02em; }
.glass .search { margin-left:auto; display:flex; gap:8px; }
.glass input {
  width: 260px; padding:8px 10px; border:1px solid #e5e7eb; border-radius:12px; outline: none;
}
.glass button {
  padding:8px 12px; border:none; border-radius:12px;
  background:#2563eb; color:#fff; font-weight:600; cursor:pointer;
}
.glass button:active { transform: translateY(1px); }
@media (max-width: 640px) {
  .glass .search { display:none; }
}
</style>
