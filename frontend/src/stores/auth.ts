import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'

import { apiGetAuthCode, apiPostAuthCode, apiValidateAccessToken, apiValidateGoogleCredential } from '@/api/auth'
import { removeToken, setToken } from '@/utils/token'

export const useAuthStore = defineStore('auth', () => {
  const state = reactive<UserInfo>({
    nome: '',
    email: '',
    picture: '',
    admin: false
  })

  const authCodeId = ref('')

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

  const generateAuthCode = async ({ email }: { email: string }) => {
    const { data } = await apiGetAuthCode(email)
    
    authCodeId.value = data.id
  }

  const verifyAuthCode = async ({ code }: { code: string}) => {
    const { data } = await apiPostAuthCode(authCodeId.value, code)
    
    authCodeId.value = ''

    setToken(data.token)
  }

  return {
    nome,
    email,
    picture,
    admin,
    validateAccessToken,
    validateGoogleCredential,
    generateAuthCode,
    verifyAuthCode
  }
})