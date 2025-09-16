import { ref, onMounted } from 'vue'

export function useDark() {
  const isDark = ref(false)

  const apply = () => {
    const root = document.documentElement
    isDark.value ? root.classList.add('dark') : root.classList.remove('dark')
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }

  onMounted(() => {
    const saved = localStorage.getItem('theme')
    isDark.value = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
    apply()
  })

  const toggle = () => { isDark.value = !isDark.value; apply() }

  return { isDark, toggle }
}
