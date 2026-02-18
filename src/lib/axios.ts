import axios from 'axios'

export const apiClient = axios.create({
  baseURL: typeof window !== 'undefined' ? '/api' : 'http://localhost:5000/api', // Fallback for SSR if needed
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add request interceptor to include tenant ID in all requests
apiClient.interceptors.request.use(
  (config) => {
    // Only run on client-side
    if (typeof window !== 'undefined') {
      try {
        // Get tenant from localStorage (Zustand persist storage)
        const tenantStorage = localStorage.getItem('tenant-storage')
        if (tenantStorage) {
          const { state } = JSON.parse(tenantStorage)
          const activeTenant = state?.activeTenant
          
          if (activeTenant?.id) {
            // Add tenant ID as header
            config.headers['X-Tenant-Id'] = activeTenant.id
            
            // Optionally add as query param (if your backend expects it)
            // config.params = { ...config.params, tenantId: activeTenant.id }
          }
        }
      } catch (error) {
        console.error('Error reading tenant from storage:', error)
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
