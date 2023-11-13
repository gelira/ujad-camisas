import { reactive } from 'vue'

import { apiClient } from '../api'
import { ACCESS_TOKEN_LOCAL_STORAGE } from '@/consts'

export function useAuth() {
  const auth = reactive({ nome: '', email: '', admin: false })
  
  const validateGoogleToken = async (token: string) => {
    const { data } = await apiClient(false)
      .post<{ token: string }>('/auth/google', { token })

    localStorage.setItem(ACCESS_TOKEN_LOCAL_STORAGE, data.token)
  }

  return { auth, validateGoogleToken }
}