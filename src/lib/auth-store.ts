import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  email: string
  name: string
  role: 'admin' | 'user'
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (
    email: string | undefined,
    password: string | undefined
  ) => Promise<boolean>
  logout: () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email, password) => {
        // Fake authentication logic
        if (email === 'admin@example.com' && password === 'admin') {
          set({
            user: {
              email: 'admin@example.com',
              name: 'Admin User',
              role: 'admin'
            },
            isAuthenticated: true
          })
          return true
        }
        return false
      },
      logout: () => {
        set({ user: null, isAuthenticated: false })
      }
    }),
    {
      name: 'auth-storage'
    }
  )
)
