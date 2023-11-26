<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, useRoute, RouterView } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
import { useSetorStore } from '@/stores/setor'
import AppBar from '@/components/AppBar.vue'

const router = useRouter()
const route = useRoute()

const authStore = useAuthStore()
const setorStore = useSetorStore()

onMounted(() => {
  (async () => {
    try {
      await authStore.validateAccessToken()
      await setorStore.fetchSetores()

      if (authStore.admin || route.name === 'camisas' || setorStore.setores.length === 0) {
        return
      }

      router.push({
        name: 'camisas',
        params: {
          id: setorStore.setores[0].id
        }
      })
    } catch {
      router.push({ name: 'login' })
    }
  })()
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
