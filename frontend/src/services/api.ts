import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE,
})

export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api'


 // Для отладки:
console.log('API baseURL:', api.defaults.baseURL)