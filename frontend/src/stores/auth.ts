import { computed, reactive } from 'vue'
import { defineStore } from 'pinia'

import { apiValidateAccessToken, apiValidateGoogleCredential } from '@/api/auth'
import { removeToken, setToken } from '@/utils/token'

export const useAuthStore = defineStore('auth', () => {
  const state = reactive<UserInfo>({
    nome: '',
    email: '',
    admin: false
  })

  const nome = computed(() => state.nome)
  const email = computed(() => state.email)
  const admin = computed(() => state.admin)

  const validateAccessToken = async () => {
    try {
      const { data } = await apiValidateAccessToken()
      state.nome = data.nome
      state.email = data.email
      state.admin = data.admin
    } catch (e) {
      removeToken()
      throw e
    }
  }

  const validateGoogleCredential = async (credential: string) => {
    const { data } = await apiValidateGoogleCredential(credential)
    setToken(data.token)
  }

  return {
    state,
    nome,
    email,
    admin,
    validateAccessToken,
    validateGoogleCredential
  }
})