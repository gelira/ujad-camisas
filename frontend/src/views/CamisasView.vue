<script setup lang="ts">
import { computed, reactive, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

import { useCamisaStore } from '@/stores/camisa'
import { useRemessaStore } from '@/stores/remessa'

import CamisasTable from '@/components/CamisasTable.vue'
import DeleteCamisa from '@/components/DeleteCamisa.vue'
import CamisaForm from '@/components/CamisaForm.vue'

interface State {
  camisaIdToEdit: string
  camisaIdToDelete: string 
  openForm: boolean
  search: string
  loading: string | boolean
}

const route = useRoute()

const state = reactive<State>({
  camisaIdToEdit: '',
  camisaIdToDelete: '',
  openForm: false,
  search: '',
  loading: false
})

const camisaStore = useCamisaStore()
const remessaStore = useRemessaStore()

const setorId = computed(() => route.params.id as string)
const remessaId = computed(() => remessaStore.remessaAberta?.id ?? '')

watchEffect(() => {
  if (setorId.value && remessaId.value) {
      state.loading = 'primary'

      camisaStore.fetchCamisas(setorId.value, remessaId.value)
        .catch(() => {})
        .finally(() => state.loading = false)
  }
})
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
    />
    <v-btn
      icon="mdi-plus"
      color="success"
      density="comfortable"
      :disabled="!remessaStore.remessaAberta"
      @click="state.openForm = true"
    />
  </div>
  <CamisasTable
    :search="state.search"
    :loading="state.loading"
    @edit="state.camisaIdToEdit = $event; state.openForm = true"
    @delete="state.camisaIdToDelete = $event"
  />
  <CamisaForm
    :camisa-id="state.camisaIdToEdit"
    :open="state.openForm"
    @close="state.camisaIdToEdit = ''; state.openForm = false"
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
}
</style>