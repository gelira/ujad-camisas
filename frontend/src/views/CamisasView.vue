<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useRoute } from 'vue-router'

import { fetchCamisas, type Camisa } from '@/api/camisa'
import CamisasTable from '@/components/CamisasTable.vue'
import DeleteCamisa from '@/components/DeleteCamisa.vue'

interface State {
  camisas: Camisa[]
  camisaToEdit: Camisa | null
  camisaToDelete: Camisa | null
}

const route = useRoute()

const state = reactive<State>({
  camisas: [],
  camisaToEdit: null,
  camisaToDelete: null
})

const findCamisaById = (id: string) => {
  return state.camisas.find(i => i.id === id) ?? null
}

const handleDeleted = (camisaId: string) => {
  state.camisas = state.camisas.filter(({ id }) => camisaId !== id)
  state.camisaToDelete = null
}

watch(
  () => route.params.id,
  (setorId) => {
    fetchCamisas(setorId)
      .then(({ data }) => state.camisas = data.camisas)
      .catch(() => state.camisas = [])
  },
  { immediate: true }
)
</script>

<template>
  <CamisasTable
    :camisas="state.camisas"
    @edit="state.camisaToEdit = findCamisaById($event)"
    @delete="state.camisaToDelete = findCamisaById($event)"
  />
  <DeleteCamisa
    :camisa="state.camisaToDelete"
    @close="state.camisaToDelete = null"
    @deleted="handleDeleted($event)"
  />
</template>
