import { createContext, useState, useEffect } from 'react'
import { login as apiLogin, logout as apiLogout, getMe } from '../services/authService'
import { queryClient } from '../lib/queryClient'

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    getMe()
      .then((data) => {
        if (!cancelled) setUser(data)
      })
      .catch(() => {
        if (!cancelled) setUser(null)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const login = async (email, password) => {
    await apiLogin(email, password)
    const me = await getMe()
    setUser(me)
  }

  const logout = async () => {
    await apiLogout()
    setUser(null)
    queryClient.clear()
  }

  const refreshUser = async () => {
    const me = await getMe()
    setUser(me)
    return me
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout, loading, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  )
}
