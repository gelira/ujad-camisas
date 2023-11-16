<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useRouter, RouterView } from 'vue-router'

import { fetchSetores, type Setor } from '@/api/setor'

const state = reactive<{ setores: Setor[] }>({
  setores: []
})

const router = useRouter()

const updateHandler = (id: string) => {
  router.push({ name: 'camisas', params: { id } })
}

onMounted(() => {
  fetchSetores()
    .then(({ data }) => state.setores = data.setores)
    .catch(() => {})
})
</script>

<template>
  <v-select
    label="Selecionar o setor"
    :items="state.setores"
    item-title="nome"
    item-value="id"
    @update:model-value="updateHandler"
  ></v-select>
  <RouterView />
</template>