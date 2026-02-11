import axios from 'axios'

export const apiClient = axios.create({
  baseURL: typeof window !== 'undefined' ? '/api' : 'http://localhost:5000/api', // Fallback for SSR if needed
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})
