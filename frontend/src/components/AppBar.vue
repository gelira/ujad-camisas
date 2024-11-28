<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/auth'
import { useRemessaStore } from '@/stores/remessa'
import { useSetorStore } from '@/stores/setor'
import { removeToken } from '@/utils/token'
import GerarRelatorioDialog from './GerarRelatorioDialog.vue'

interface State {
  drawerOpen: boolean
  menuOpen: string[]
}

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const setorStore = useSetorStore()
const remessaStore = useRemessaStore()

const state = reactive<State>({
  drawerOpen: false,
  menuOpen: ['setores']
})

const title = computed(() => {
  if (!setorStore.setorSelected) {
    return 'UJAD Camisas'
  }
  return `Setor - ${setorStore.setorSelected.nome}`
})

const setorId = computed(() => route.params.id as string)

const setorMenuOpen = computed(() => state.menuOpen.includes('setores'))

const vListItemProps = computed(() => ({
  title: authStore.nome,
  ...(authStore.picture
      ? { appendAvatar: authStore.picture }
      : { appendIcon: 'mdi-account-circle' }
  )
}))

const listRemessasComputed = computed(
  () => remessaStore.remessas.map(({ id, descricao: label }) => ({ id, label }))
)

const listSetoresComputed = computed(
  () => setorStore.setores.map(({ id, nome: label }) => ({ id, label }))
)

const toggle = () => {
  state.drawerOpen = !state.drawerOpen
}

const navigate = (id: string) => {
  if (id !== setorId.value) {
    router.push({ name: 'camisas', params: { id } })
  }
  state.drawerOpen = false
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
      <v-list-group
        value="setores"
        :class="['setores', { open: setorMenuOpen }]"
      >
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            title="Setores"
            :variant="setorMenuOpen ? 'elevated' : 'text'"
          />
        </template>

        <v-list-item
          v-for="{ id, nome } in setorStore.setores"
          :key="id"
          :title="nome"
          :variant="setorId === id ? 'tonal' : 'text'"
          @click="navigate(id)"
        />
      </v-list-group>
      <v-divider />
      <GerarRelatorioDialog
        title="Gerar relatório - Contagem de pedidos"
        subtitle="Selecione a remessa"
        :listValues="listRemessasComputed"
        @generate="console.log('Contagem', $event)"
      >
        <template v-slot="{ openDialog }">
          <v-list-item
            title="Contagem de pedidos"
            append-icon="mdi-clipboard-list-outline"
            @click="openDialog"
          />
        </template>
      </GerarRelatorioDialog>
      <v-divider />
      <GerarRelatorioDialog
        title="Gerar relatório - Lista de camisas"
        subtitle="Selecione o setor"
        :listValues="listSetoresComputed"
        @generate="console.log('Lista', $event)"
      >
        <template v-slot="{ openDialog }">
          <v-list-item
            title="Lista de camisas"
            append-icon="mdi-clipboard-text-outline"
            @click="openDialog"
          />
        </template>
      </GerarRelatorioDialog>
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

<style scoped lang="scss">
.v-list {
  height: calc(100dvh - 64px);
}

.setores {
  max-height: calc(100% - 196px);

  &.open {
    height: 100%;
  }

  :deep(.v-list-group__items) {
    max-height: calc(100% - 48px);
    overflow: auto;
  }
}

.logout {
  color: red;
}
</style>