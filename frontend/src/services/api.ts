import axios from 'axios'

// ⚡ Жёстко задаём прод-адрес, а локально будет fallback
const PROD_BASE = 'https://maxivip-news-cee1.twc1.net/api'
const LOCAL_BASE = 'http://localhost:8080/api'

export const API_BASE = window.location.hostname === 'localhost' ? LOCAL_BASE : PROD_BASE

export const api = axios.create({
	baseURL: API_BASE,
})

// Для отладки
console.log('🌐 API baseURL:', API_BASE)
