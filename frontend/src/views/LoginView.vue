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
  <v-container class="h-screen">
    <v-sheet
      class="d-flex align-center justify-center flex-wrap text-center mx-auto"
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
  </v-container>
</template>

<style scoped>
.v-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.v-sheet {
  padding: 20px;
  width: fit-content;
}

.v-divider {
  margin: 10px 0 0;
  padding: 16px 0 0;
}

.login-title {
  margin: 0 0 32px;
}
</style>
