<script setup lang="ts">
import { GoogleLogin, decodeCredential } from 'vue3-google-login'
import TheWelcome from '../components/TheWelcome.vue'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

const callback = (response: { credential: string }) => {
  const userData = decodeCredential(response.credential)
  console.log(userData)
}
</script>

<template>
  <main>
    <GoogleLogin
      :client-id="CLIENT_ID"
      :callback="callback" 
    />
    <TheWelcome />
  </main>
</template>
