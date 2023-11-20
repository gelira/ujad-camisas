<script setup lang="ts">
import { reactive, watch } from 'vue'

import { useCamisaStore } from '@/stores/camisa'

interface State {
  camisa: Camisa | null
  open: boolean
}

const props = defineProps<{ camisaId: string }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const state = reactive<State>({
  camisa: null, 
  open: false
})

const camisaStore = useCamisaStore()

const handleDelete = () => {
  if (props.camisaId) {
    camisaStore.deleteCamisa(props.camisaId)
      .then(() => emit('close'))
      .catch(() => {})
  }
}

watch(
  () => props.camisaId,
  (value) => {
    state.camisa = camisaStore.findById(value)
    state.open = !!value
  }
)
</script>

<template>
  <v-dialog v-model="state.open">
    <v-card>
      <v-card-title>Deseja realmente excluir a camisa?</v-card-title>
      <v-card-text>
        <p>Nome: {{ state.camisa?.nomePessoa ?? '' }}</p>
        <p>Modelo: {{ state.camisa?.modeloDescricao ?? '' }}</p>
        <p>Tamanho: {{ state.camisa?.tamanhoDescricao ?? '' }}</p>
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
