<script setup lang="ts">
import { GoogleLogin, type CallbackTypes } from 'vue3-google-login'

import { useAuth } from '@/composables/auth'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

const { validateGoogleToken } = useAuth()

const callback: CallbackTypes.CredentialCallback = ({ credential }) => {
  validateGoogleToken(credential)
}
</script>

<template>
  <GoogleLogin
    :client-id="CLIENT_ID"
    :callback="callback"
  />
</template>