<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, useRoute, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

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
  <v-container class="h-screen">
    <RouterView />
  </v-container>
</template>
