<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { RouterView } from 'vue-router'

import { useNavigation } from '@/composables/navigation'
import { useAuthStore } from '@/stores/auth'
import { useRemessaStore } from '@/stores/remessa'
import { useSetorStore } from '@/stores/setor'

import AppBar from '@/components/AppBar.vue'

const navigation = useNavigation()
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
      navigation.goToLogin()
    }
  })()
})

watch(
  () => setorStore.setores,
  (v) => {
    !!v?.length && navigation.goToCamisas(v[0].id)
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
