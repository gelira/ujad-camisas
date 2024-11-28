<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { useNavigation } from '@/composables/navigation'
import { useSetorStore } from '@/stores/setor'

const props = defineProps<{ menuOpen: string[] }>()

const route = useRoute()
const navigation = useNavigation()
const setorStore = useSetorStore()

const setorId = computed(() => route.params.id as string)
const setorMenuOpen = computed(() => props.menuOpen.includes('setores'))

const navigate = (id: string) => {
  if (id !== setorId.value) {
    navigation.goToCamisas(id)
  }
}
</script>

<template>
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
</template>

<style scoped lang="scss">
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
</style>