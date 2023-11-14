<script setup lang="ts">
import { useCamisas } from '@/composables/camisa'

const { camisas } = useCamisas()
</script>

<template>
  <ul>
    <li v-for="camisa in camisas" :key="camisa.id">
      {{ camisa.nomePessoa }}
    </li>
  </ul>
</template>