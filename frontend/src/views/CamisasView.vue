<script setup lang="ts">
import CamisasTable from '@/components/CamisasTable.vue'
</script>

<template>
  <CamisasTable
    @edit="console.log('edit', $event)"
    @delete="console.log('delete', $event)"
  />
</template>
