<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { GoogleLogin, type CallbackTypes } from 'vue3-google-login'

import { useAuthStore } from '@/stores/auth'
import { getToken } from '@/utils/token'

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

const router = useRouter()

const authStore = useAuthStore()

const navigateHome = () => router.push({ name: 'home' })

const callback: CallbackTypes.CredentialCallback = ({ credential }) => {
  authStore.validateGoogleCredential(credential)
    .then(() => navigateHome())
    .catch(() => {})
}

onMounted(() => {
  if (getToken()) {
    navigateHome()
  }
})
</script>

<template>
   <v-sheet
    class="d-flex align-center justify-center flex-wrap text-center mx-auto login-container"
    max-width="800"
    width="100%"
    elevation="4"
    rounded
    border
  >
    <div>
      <h2 class="login-title">UJAD Camisas</h2>
      <h4>Bem-vindo(a)!</h4>
      <p>Acesse sua conta através do email Google cadastrado.</p>
      <v-divider></v-divider>
      <GoogleLogin
        :client-id="CLIENT_ID"
        :callback="callback"
      />
    </div>
  </v-sheet>
</template>

<style scoped lang="scss">
.login-container {
  padding: 20px 0;
  
  :deep(.v-divider) {
    margin: 10px 0 0;
    padding: 16px 0 0;
  }
}

.login-title {
  margin: 0 0 32px;
}
</style>
