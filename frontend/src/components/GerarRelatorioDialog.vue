<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue';

import { useAuthStore } from '@/stores/auth';

const props = defineProps<{
  title: string
  subtitle: string
  listValues: { id: string, label: string }[]
}>()

const emit = defineEmits<{
  (e: 'generate', id?: string): void
}>()

const state = reactive({ open: false, selectedId: '' })

const authStore = useAuthStore()

const listValuesComputed = computed(() => {
  if (!authStore.admin) {
    return props.listValues
  }

  return [
    { id: '', label: 'Geral' },
    ...props.listValues
  ]
})

const openDialog = () => {
  state.open = true
}

const closeDialog = () => {
  state.open = false
  state.selectedId = listValuesComputed.value[0]?.id ?? ''
}

const generateReport = () => {
  emit('generate', state.selectedId || undefined)
  closeDialog()
}

onMounted(() => {
  closeDialog()
})
</script>

<template>
  <slot :openDialog="openDialog"></slot>

  <v-dialog v-model="state.open" persistent>
    <v-card width="600px" :title="title">
      <v-card-text>
        <v-select
          :label="subtitle"
          :items="listValuesComputed"
          v-model:model-value="state.selectedId"
          item-title="label"
          item-value="id"
        >
        </v-select>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="closeDialog">
          Cancelar
        </v-btn>
        <v-btn @click="generateReport">
          Gerar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
:deep(.v-overlay__content) {
  align-items: center;
}
</style>