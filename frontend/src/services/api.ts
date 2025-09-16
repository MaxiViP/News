import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// ✅ Логируем базовый URL при запуске
console.log('API baseURL:', api.defaults.baseURL)
