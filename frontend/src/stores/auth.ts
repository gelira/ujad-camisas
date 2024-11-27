import { computed, reactive } from 'vue'
import { defineStore } from 'pinia'

import { apiValidateAccessToken, apiValidateGoogleCredential } from '@/api/auth'
import { removeToken, setToken } from '@/utils/token'

export const useAuthStore = defineStore('auth', () => {
  const state = reactive<UserInfo>({
    nome: '',
    email: '',
    picture: '',
    admin: false
  })

  const nome = computed(() => state.nome)
  const email = computed(() => state.email)
  const picture = computed(() => state.picture)
  const admin = computed(() => state.admin)

  const validateAccessToken = async () => {
    try {
      const { data } = await apiValidateAccessToken()
      state.nome = data.nome
      state.email = data.email
      state.admin = data.admin
      state.picture = data.picture
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
    nome,
    email,
    picture,
    admin,
    validateAccessToken,
    validateGoogleCredential
  }
})