import { ref, onMounted } from 'vue'

export function useDark() {
	const isDark = ref(false)

	const apply = () => {
		const root = document.documentElement
		if (isDark.value) {
			root.classList.add('dark')
		} else {
			root.classList.remove('dark')
		}
		localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
	}

	onMounted(() => {
		const saved = localStorage.getItem('theme')
		if (saved) {
			isDark.value = saved === 'dark'
		} else {
			// 👇 по умолчанию светлая тема
			isDark.value = false
		}
		apply()
	})

	const toggle = () => {
		isDark.value = !isDark.value
		apply()
	}

	return { isDark, toggle }
}
