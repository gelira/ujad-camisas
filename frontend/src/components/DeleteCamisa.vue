<script setup lang="ts">
import { reactive, watch } from 'vue'

import { deleteCamisa } from '@/api/camisa'

const props = defineProps<{ camisa: Camisa | null }>()
const emit = defineEmits<{
  (e: 'close'): void, 
  (e: 'deleted', value: string): void 
}>()
const state = reactive({ open: false })

const handleDelete = () => {
  if (props.camisa) {
    const camisaId = props.camisa.id

    deleteCamisa(camisaId)
      .then(() => emit('deleted', camisaId))
      .catch(() => {})
  }
}

watch(
  () => props.camisa,
  (value) => state.open = !!value
)
</script>

<template>
  <v-dialog v-model="state.open">
    <v-card>
      <v-card-title>Deseja realmente excluir a camisa?</v-card-title>
      <v-card-text>
        <p>Nome: {{ camisa?.nomePessoa ?? '' }}</p>
        <p>Modelo: {{ camisa?.modeloDescricao ?? '' }}</p>
        <p>Tamanho: {{ camisa?.tamanhoDescricao ?? '' }}</p>
      </v-card-text>
      <v-card-actions>
        <v-btn
          variant="elevated"
          color="primary"
          @click="emit('close')"
        >Cancelar</v-btn>
        <v-btn
          variant="elevated"
          color="error"
          @click="handleDelete"
        >Excluir</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.v-card-actions {
  justify-content: flex-end;
}
</style>
