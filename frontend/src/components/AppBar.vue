<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
import { useSetorStore } from '@/stores/setor'
import { removeToken } from '@/utils/token'

import RelatoriosMenu from './RelatoriosMenu.vue'
import SetoresMenu from './SetoresMenu.vue'

const router = useRouter()
const authStore = useAuthStore()
const setorStore = useSetorStore()

const state = reactive({
  drawerOpen: false,
  menuOpen: ['setores']
})

const title = computed(() => {
  if (!setorStore.setorSelected) {
    return 'UJAD Camisas'
  }
  return `Setor - ${setorStore.setorSelected.nome}`
})

const vListItemProps = computed(() => ({
  title: authStore.nome,
  ...(authStore.picture
      ? { appendAvatar: authStore.picture }
      : { appendIcon: 'mdi-account-circle' }
  )
}))

const toggle = () => {
  state.drawerOpen = !state.drawerOpen
}

const logout = () => {
  removeToken()
  router.push({ name: 'login' })
}
</script>

<template>
  <v-app-bar elevation="2" color="primary">
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click="toggle" />
    </template>
    <v-app-bar-title>{{ title }}</v-app-bar-title>
  </v-app-bar>
  <v-navigation-drawer
    v-model="state.drawerOpen"
    temporary
  >
    <v-list v-model:opened="state.menuOpen">
      <v-list-item v-bind="vListItemProps" />
      <v-divider />
      <SetoresMenu :menu-open="state.menuOpen" />
      <v-divider />
      <RelatoriosMenu />
      <v-divider />
      <v-list-item
        title="Sair"
        append-icon="mdi-logout"
        class="logout"
        @click="logout"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>
.v-list {
  height: calc(100dvh - 64px);
}

.logout {
  color: red;
}
</style>