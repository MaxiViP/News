import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
})

 // Для отладки:
console.log('API baseURL:', api.defaults.baseURL)