import { reactive } from 'vue'

import { apiClient } from '@/api'
import { ACCESS_TOKEN_LOCAL_STORAGE } from '@/consts'

interface UserInfo {
  nome: string
  email: string
  admin: boolean
}

export function useAuth() {
  const authState = reactive({ nome: '', email: '', admin: false })
  
  const getToken = () => {
    return localStorage.getItem(ACCESS_TOKEN_LOCAL_STORAGE)
  }

  const setToken = (token: string) => {
    localStorage.setItem(ACCESS_TOKEN_LOCAL_STORAGE, token)
  }

  const removeToken = () => {
    localStorage.removeItem(ACCESS_TOKEN_LOCAL_STORAGE)
  }

  const validateGoogleToken = async (token: string) => {
    const { data } = await apiClient(false)
      .post<{ token: string }>('/auth/google', { token })

    setToken(data.token)
  }

  const validateAccessToken = async () => {
    try {
      const { data } = await apiClient().get<UserInfo>('/auth/user-info')

      authState.nome = data.nome
      authState.email = data.email
      authState.admin = data.admin
    } catch (e) {
      removeToken()
      throw e
    }
  }

  return {
    authState,
    getToken,
    validateGoogleToken,
    validateAccessToken
  }
}