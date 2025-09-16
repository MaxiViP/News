<template>
  <div class="mx-auto max-w-6xl p-4 sm:p-6">
    <header class="sticky top-3 z-50 mb-6 rounded-2xl border border-white/50 bg-white/70 backdrop-blur-md shadow-glass
                   dark:border-slate-700/60 dark:bg-slate-900/60">
      <div class="flex items-center gap-3 px-4 py-3">
        <div class="flex items-center gap-2">
          <div class="h-9 w-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 shadow-soft"></div>
          <h1 class="m-0 text-lg font-semibold tracking-[-0.02em] sm:text-xl">Новостной портал</h1>
        </div>

        <form class="ml-auto hidden items-center gap-2 sm:flex" @submit.prevent="$router.push('/search/'+(q||''))">
          <input v-model="q" type="search" placeholder="Поиск по новостям..."
                 class="w-64 rounded-xl border-slate-200 bg-white/70 px-3 py-2 text-sm shadow-sm outline-none
                        focus:border-brand-400 focus:ring-2 focus:ring-brand-200 dark:bg-slate-800/70 dark:border-slate-700 dark:focus:ring-brand-800/40" />
          <button class="rounded-xl bg-brand-600 px-3 py-2 text-sm font-medium text-white shadow-soft
                         hover:bg-brand-500 active:scale-[.98] transition">
            Искать
          </button>
        </form>

        <button @click="toggle()"
                class="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white/70
                       shadow-sm transition hover:scale-105 dark:border-slate-700 dark:bg-slate-800/70" title="Тема">
          <span v-if="!isDark">🌙</span>
          <span v-else>☀️</span>
        </button>
      </div>
    </header>

    <router-view v-slot="{ Component }">
      <transition name="route" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDark } from './composables/useDark'
const q = ref('')
const { isDark, toggle } = useDark()
</script>

<style>
.route-enter-from { opacity: 0; transform: translateY(8px) scale(.98); }
.route-enter-active, .route-leave-active { transition: all .28s ease; }
.route-leave-to { opacity: 0; transform: translateY(-8px) scale(.98); }
</style>
