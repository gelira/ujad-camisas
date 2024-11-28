<script setup lang="ts">
import { computed, reactive } from 'vue';

import { useAuthStore } from '@/stores/auth';

const props = defineProps<{
  title: string
  subtitle: string
  listValues: { id: string, label: string }[]
}>()

const state = reactive({ open: false })

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
</script>

<template>
  <slot :openDialog="openDialog"></slot>

  <v-dialog v-model="state.open">
    <v-card width="600px" :title="title">
      <v-card-text>
        <v-select
          :label="subtitle"
          :items="listValuesComputed"
          item-title="label"
          item-value="id"
        >
        </v-select>
      </v-card-text>
      <v-card-actions>
        <v-btn
          @click="state.open = false"
        >
          Cancelar
        </v-btn>
        <v-btn
          @click="state.open = false"
        >
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