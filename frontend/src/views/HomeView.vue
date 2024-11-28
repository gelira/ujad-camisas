<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { RouterView, useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
import { useRemessaStore } from '@/stores/remessa'
import { useSetorStore } from '@/stores/setor'

import AppBar from '@/components/AppBar.vue'

const router = useRouter()
const authStore = useAuthStore()
const setorStore = useSetorStore()
const remessaStore = useRemessaStore()

onMounted(() => {
  (async () => {
    try {
      await authStore.validateAccessToken()

      await Promise.all([
        setorStore.fetchSetores(),
        remessaStore.fetchRemessas(),
        remessaStore.fetchRemessaAberta()
      ])
    } catch {
      router.push({ name: 'login' })
    }
  })()
})

watch(
  () => setorStore.setores,
  (v) => {
    if (v.length > 0) {
      router.push({ name: 'camisas', params: { id: v[0].id } })
    }
  }
)
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
