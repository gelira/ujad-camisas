<script setup lang="ts">
import { computed, onMounted, reactive, watch } from 'vue'
import { useRouter, useRoute, RouterView } from 'vue-router'

import { useSetorStore } from '@/stores/setor'

interface State {
  setorSelected: string | null
}

const router = useRouter()
const route = useRoute()

const setorStore = useSetorStore()

const state = reactive<State>({ setorSelected: null })

const readonly = computed(() => setorStore.setores.length < 2)

onMounted(() => {
  setorStore.fetchSetores()
    .then(() => {
      const setorId = route.params.id as string

      if (setorId) {
        state.setorSelected = setorId
        return
      }

      if (setorStore.setores.length === 1) {
        state.setorSelected = setorStore.setores[0].id
      }
    })
    .catch(() => {})
})

watch(
  () => state.setorSelected,
  (id, oldId) => {
    if (id && id !== oldId) {
      router.push({ name: 'camisas', params: { id } })
    }
  },
  { immediate: true }
)
</script>

<template>
  <v-select
    label="Selecionar o setor"
    :items="setorStore.setores"
    v-model="state.setorSelected"
    item-title="nome"
    item-value="id"
    variant="outlined"
    density="compact"
    hide-details
    :readonly="readonly"
  ></v-select>
  <RouterView />
</template>