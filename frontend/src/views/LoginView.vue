<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { GoogleLogin, type CallbackTypes } from 'vue3-google-login'

import { useAuth } from '@/composables/auth'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

const router = useRouter()
const { validateGoogleToken, getToken } = useAuth()

const callback: CallbackTypes.CredentialCallback = ({ credential }) => {
  validateGoogleToken(credential)
    .then(() => router.push('/'))
    .catch(() => {})
}

onMounted(() => {
  if (getToken()) {
    router.push('/')
  }
})
</script>

<template>
  <GoogleLogin
    :client-id="CLIENT_ID"
    :callback="callback"
  />
</template>