<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, useRoute, RouterView } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
import AppBar from '@/components/AppBar.vue'

const router = useRouter()
const route = useRoute()

const authStore = useAuthStore()

onMounted(() => {
  authStore.validateAccessToken()
    .then(() => {
      if (route.name !== 'setores' && route.name !== 'camisas') {
        router.push({ name: 'setores' })
      }
    })
    .catch(() => router.push({ name: 'login' }))
})
</script>

<template>
  <AppBar />
  <v-container>
    <RouterView />
  </v-container>
</template>

<style scoped>
.v-container {
  margin-top: 64px;
  height: calc(100dvh - 64px);
}
</style>
