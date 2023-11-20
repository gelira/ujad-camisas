<script setup lang="ts">
import { onMounted, reactive, watch } from 'vue'
import { useRouter, RouterView } from 'vue-router'

import { fetchSetores } from '@/api/setor'

interface State {
  setores: Setor[]
  setorSelected: string | null
}

const state = reactive<State>({
  setores: [],
  setorSelected: null
})

const router = useRouter()

const navigate = () => {
  const id = state.setorSelected

  if (id) {
    router.push({ name: 'camisas', params: { id } })
  }
}

onMounted(() => {
  fetchSetores()
    .then(({ data: { setores } }) => {
      state.setores = setores
      if (setores.length === 1) {
        state.setorSelected = setores[0].id
      }
    })
    .catch(() => {})
})

watch(() => state.setorSelected, navigate, { immediate: true })
</script>

<template>
  <v-select
    label="Selecionar o setor"
    :items="state.setores"
    v-model="state.setorSelected"
    item-title="nome"
    item-value="id"
    variant="outlined"
    density="compact"
    hide-details
    :readonly="state.setores.length < 2"
  ></v-select>
  <RouterView />
</template>