<template>
  <div id="container" class="mx-auto max-w-6xl px-4 sm:px-6">
    <header class="glass">
      <div class="bar">
        <!-- логотип -->
        <h1 class="logo">
          <RouterLink to="/">
            <span class="logo-icon" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
                <circle cx="128" cy="128" r="120" fill="#ef4444"/>
                <text x="128" y="128"
                      dominant-baseline="middle" text-anchor="middle"
                      font-family="Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif"
                      font-size="96" font-weight="700" fill="#fff">NaN</text>
              </svg>
            </span>
            <span>News and News</span>
          </RouterLink>
        </h1>

        <!-- блок справа -->
        <div class="right">
          <RouterLink to="/contacts" class="contacts-link">Контакты</RouterLink>
          <form class="search" @submit.prevent="$router.push('/search/'+(q||''))">
            <input v-model="q" type="search" placeholder="Поиск по новостям..." />
            <button>Искать</button>
          </form>
        </div>
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

/* «стеклянная» шапка */
.glass {
  position: sticky; top: 12px; z-index: 50; margin-bottom: 24px;
  border: 1px solid rgba(0,0,0,.06);
  border-radius: 16px;
  background: rgba(255,255,255,.7);
  backdrop-filter: blur(6px);
  box-shadow: 0 10px 20px -12px rgba(0,0,0,.15);
}
.bar { display:flex; gap:12px; align-items:center; padding:12px 16px; }

.logo { margin:0; font-size:18px; font-weight:600; letter-spacing:-.02em; }
.logo a {
  color: inherit;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 6px;
  border-radius: 10px;
}
.logo a:hover { background: rgba(37,99,235,.08); }

.logo-icon { display:inline-flex; width: 28px; height: 28px; }
.logo-icon svg { width: 100%; height: 100%; display: block; }

/* правая часть (контакты + поиск) */
.right {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 20px;
}

.contacts-link {
  font-weight: 600;
  color: #2563eb;
  text-decoration: none;
}
.contacts-link:hover {
  text-decoration: underline;
}

.search { display:flex; gap:8px; }
.search input {
  width: 260px; padding:8px 10px; border:1px solid #e5e7eb; border-radius:12px; outline: none;
}
.search button {
  padding:8px 12px; border:none; border-radius:12px;
  background:#2563eb; color:#fff; font-weight:600; cursor:pointer;
}
.search button:active { transform: translateY(1px); }

@media (max-width: 640px) {
  .search { display:none; }
}
</style>
