<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useRoute } from 'vue-router'

import { fetchCamisas, type Camisa } from '@/api/camisa'
import CamisasTable from '@/components/CamisasTable.vue'
import DeleteCamisa from '@/components/DeleteCamisa.vue'
import CamisaForm from '@/components/CamisaForm.vue'

interface State {
  camisas: Camisa[]
  camisaToEdit: Camisa | null
  camisaToDelete: Camisa | null
  openForm: boolean
  search: string
}

const route = useRoute()

const state = reactive<State>({
  camisas: [],
  camisaToEdit: null,
  camisaToDelete: null,
  openForm: false,
  search: ''
})

const fetchCamisasAndSetState = () => {
  const setorId = route.params.id

  fetchCamisas(setorId)
    .then(({ data }) => state.camisas = data.camisas)
    .catch(() => state.camisas = [])
}

const findCamisaById = (camisaId: string) => {
  return state.camisas.find(i => i.id === camisaId) ?? null
}

const handleDeleted = (camisaId: string) => {
  state.camisas = state.camisas.filter(({ id }) => camisaId !== id)
  state.camisaToDelete = null
}

const selectToEdit = (camisaId: string) => {
  state.camisaToEdit = findCamisaById(camisaId)
  state.openForm = true
}

const selectToDelete = (camisaId: string) => {
  state.camisaToDelete = findCamisaById(camisaId)
} 

const removeSelectToEdit = () => {
  state.camisaToEdit = null
  state.openForm = false
}

const handleSaved = () => {
  fetchCamisasAndSetState()
  removeSelectToEdit()
}

watch(() => route.params.id, fetchCamisasAndSetState, { immediate: true })
</script>

<template>
  <div class="actions-container">
    <v-text-field
      v-model="state.search"
      label="Pesquisar por nome"
      variant="outlined"
      clearable
    ></v-text-field>
    <v-btn
      icon="mdi-plus"
      color="success"
      @click="state.openForm = true"
    ></v-btn>
  </div>
  <CamisasTable
    :camisas="state.camisas"
    :search="state.search"
    @edit="selectToEdit"
    @delete="selectToDelete"
  />
  <CamisaForm
    :camisa="state.camisaToEdit"
    :open="state.openForm"
    @close="removeSelectToEdit"
    @saved="handleSaved"
  />
  <DeleteCamisa
    :camisa="state.camisaToDelete"
    @close="state.camisaToDelete = null"
    @deleted="handleDeleted($event)"
  />
</template>

<style scoped>
.actions-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
}

.actions-container :deep(.v-input__details) {
  display: none;
}
</style>