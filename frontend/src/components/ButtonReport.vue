<script setup lang="ts">
import { ref } from 'vue'
import { apiClient } from '@/api/client'

const icon = ref('mdi-file-pdf-box')

const generateReport = () => {
  icon.value = 'mdi-loading mdi-spin'
  apiClient().get<{ report: string }>('/report/all')
    .then(({ data }) => {
      const dt = new Date();

      const year = dt.getFullYear();
      const month = (dt.getMonth() + 1).toString().padStart(2, '0');
      const day = dt.getDate().toString().padStart(2, '0');
      const hour = dt.getHours().toString().padStart(2, '0');
      const minute = dt.getMinutes().toString().padStart(2, '0');
      const second = dt.getSeconds().toString().padStart(2, '0');

      const filename = `Relatório UJAD Camisas ${year}${month}${day}${hour}${minute}${second}.pdf`

      const link = document.createElement('a')
      link.href = data.report
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
    .catch(() => {})
    .finally(() => {
      icon.value = 'mdi-file-pdf-box'
    })
}
</script>

<template>
  <v-btn
    variant="elevated"
    color="primary"
    text="Gerar relatório"
    :append-icon="icon"
    @click="generateReport"
  />
</template>

<style scoped>
.v-card-actions {
  justify-content: flex-end;
}
</style>
