<script setup lang="ts">
import { reactive, watch } from 'vue'

import { useCamisaStore } from '@/stores/camisa'
import { useAlertStore } from '@/stores/alert'

interface State {
  camisa: Camisa | null
  loading: string | boolean
  open: boolean
}

const props = defineProps<{ camisaId: string }>()
const emit = defineEmits<{ (e: 'close'): void }>()

const state = reactive<State>({
  camisa: null,
  loading: false,
  open: false
})

const camisaStore = useCamisaStore()
const alertStore = useAlertStore()

const handleDelete = async () => {
  if (!props.camisaId) {
    return
  }

  state.loading = 'primary'

  try {
    await camisaStore.deleteCamisa(props.camisaId)
    emit('close')
  } catch {
    alertStore.showAlert('Não foi possível excluir o pedido. Tente novamente.')
  } finally {
    state.loading = false
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
  <v-dialog v-model="state.open" persistent>
    <v-card :loading="state.loading">
      <v-card-title>Deseja excluir o pedido?</v-card-title>
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
