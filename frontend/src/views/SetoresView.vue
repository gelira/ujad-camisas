<script setup lang="ts">
import { useRouter, RouterView } from 'vue-router'
import { useSetores } from '@/composables/setor'

const router = useRouter()
const { setores } = useSetores()

const updateHandler = (id: string) => {
  router.push({ name: 'camisas', params: { id } })
}
</script>

<template>
  <v-select
    label="Selecionar o setor"
    :items="setores"
    item-title="nome"
    item-value="id"
    @update:model-value="updateHandler"
  ></v-select>
  <RouterView />
</template>