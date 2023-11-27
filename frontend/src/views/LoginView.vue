<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { GoogleLogin, type CallbackTypes } from 'vue3-google-login'

import { useAuthStore } from '@/stores/auth'
import { getToken } from '@/utils/token'

interface State {
  loading: boolean | string
}

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

const router = useRouter()
const authStore = useAuthStore()

const state = reactive<State>({ loading: false })

const navigateHome = () => {
  router.push({ name: 'home' })
}

const callback: CallbackTypes.CredentialCallback = ({ credential }) => {
  (async () => {
    state.loading = 'primary'

    try {
      await authStore.validateGoogleCredential(credential)
      navigateHome()
    } catch {
      // do nothing
    } finally {
      state.loading = false
    }
  })()
}

onMounted(() => {
  if (getToken()) {
    navigateHome()
  }
})
</script>

<template>
  <v-container class="h-screen">
    <v-card
      :loading="state.loading"
      elevation="4"
      rounded
      border
    >
      <v-card-title>UJAD Camisas</v-card-title>
      <v-card-text>
        <strong>Bem-vindo(a)!</strong>
        <br>
        Acesse sua conta através do email Google cadastrado.
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <GoogleLogin
          :client-id="CLIENT_ID"
          :callback="callback"
        />
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<style scoped lang="scss">
.v-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 800px;
}

.v-card-title {
  padding-top: 16px;
  font-size: 24px;
  text-align: center;
}

.v-card-text {
  padding: 16px;
  font-size: 18px;
  line-height: 28px !important;
  text-align: center;
}

.v-card-actions {
  padding: 16px;
  justify-content: center;
}
</style>
