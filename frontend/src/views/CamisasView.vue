<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useRoute } from 'vue-router'

import { useCamisaStore } from '@/stores/camisa'
import CamisasTable from '@/components/CamisasTable.vue'
import DeleteCamisa from '@/components/DeleteCamisa.vue'
import CamisaForm from '@/components/CamisaForm.vue'

interface State {
  camisaIdToEdit: string
  camisaIdToDelete: string 
  openForm: boolean
  search: string
}

const route = useRoute()

const state = reactive<State>({
  camisaIdToEdit: '',
  camisaIdToDelete: '',
  openForm: false,
  search: ''
})

const camisaStore = useCamisaStore()

watch(
  () => route.params.id, 
  (value) => {
    if (value) {
      camisaStore.fetchCamisas(value as string)
        .catch(() => {})
    }
  }, 
  { immediate: true }
)
</script>

<template>
  <div class="actions-container">
    <v-text-field
      v-model="state.search"
      label="Pesquisar por nome"
      variant="outlined"
      density="compact"
      hide-details
      clearable
    ></v-text-field>
    <v-btn
      icon="mdi-plus"
      color="success"
      density="comfortable"
      @click="state.openForm = true"
    ></v-btn>
  </div>
  <CamisasTable
    :search="state.search"
    @edit="state.camisaIdToEdit = $event"
    @delete="state.camisaIdToDelete = $event"
  />
  <CamisaForm
    :camisa-id="state.camisaIdToEdit"
    :open="state.openForm"
    @close="state.camisaIdToEdit = ''"
  />
  <DeleteCamisa
    :camisa-id="state.camisaIdToDelete"
    @close="state.camisaIdToDelete = ''"
  />
</template>

<style scoped>
.actions-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 16px;
  margin: 12px 0 4px;
}
</style>