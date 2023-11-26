<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
import { useSetorStore } from '@/stores/setor'

const router = useRouter()
const authStore = useAuthStore()
const setorStore = useSetorStore()

const state = reactive({ drawerOpen: false })

const title = computed(() => {
  if (!setorStore.setorSelected) {
    return 'UJAD Camisas'
  }
  return `Setor - ${setorStore.setorSelected.nome}`
})

const toggle = () => {
  state.drawerOpen = !state.drawerOpen
}

const navigate = (id: string) => router.push({ name: 'camisas', params: { id } })
</script>

<template>
  <v-app-bar elevation="2" color="primary">
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click="toggle" />
    </template>
    <v-app-bar-title>{{ title }}</v-app-bar-title>
  </v-app-bar>
  <v-navigation-drawer v-model="state.drawerOpen">
    <v-list>
      <v-list-item
        append-icon="mdi-account-circle"
        :title="authStore.nome"
      />
      <v-divider />
      <v-list-group>
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" title="Setores" />
        </template>

        <v-list-item
          v-for="{ id, nome } in setorStore.setores"
          :key="id"
          :title="nome"
          @click="navigate(id)"
        />
      </v-list-group>
      <v-divider />
    </v-list>
  </v-navigation-drawer>
</template>