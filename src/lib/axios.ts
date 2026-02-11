import axios from 'axios'

export const apiClient = axios.create({
  baseURL: '/api', // Functioning within Next.js API routes
  headers: {
    'Content-Type': 'application/json'
  }
})
