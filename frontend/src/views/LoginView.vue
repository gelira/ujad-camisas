<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { GoogleLogin, type CallbackTypes } from 'vue3-google-login'

import { getToken, setToken } from '@/api/client'
import { validateGoogleToken } from '@/api/auth'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

const router = useRouter()

const navigateHome = () => router.push({ name: 'home' })

const callback: CallbackTypes.CredentialCallback = ({ credential }) => {
  validateGoogleToken(credential)
    .then(({ data }) => {
      setToken(data.token)
      navigateHome()
    })
    .catch(() => {})
}

onMounted(() => {
  if (getToken()) {
    navigateHome()
  }
})
</script>

<template>
  <GoogleLogin
    :client-id="CLIENT_ID"
    :callback="callback"
  />
</template>