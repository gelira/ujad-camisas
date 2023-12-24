<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter, useRoute, RouterView } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
import { useSetorStore } from '@/stores/setor'
import { useRemessaStore } from '@/stores/remessa'

import AppBar from '@/components/AppBar.vue'
import ButtonReport from '@/components/ButtonReport.vue'

const router = useRouter()
const route = useRoute()

const authStore = useAuthStore()
const setorStore = useSetorStore()
const remessaStore = useRemessaStore()

onMounted(() => {
  (async () => {
    try {
      await authStore.validateAccessToken()

      await Promise.all([
        setorStore.fetchSetores(),
        remessaStore.fetchRemessaAberta()
      ])

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
    <ButtonReport
      v-if="authStore.admin && route.name === 'home'"
    />
    <RouterView />
  </v-container>
</template>

<style scoped>
.v-container {
  margin-top: 64px;
  height: calc(100dvh - 64px);
}
</style>
