<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { apiClient } from '@/api/client'
import { useRemessaStore } from '@/stores/remessa'

const remessaStore = useRemessaStore()

const icon = ref('mdi-file-pdf-box')

function generateReport(id: string) {
  icon.value = 'mdi-loading mdi-spin'
  apiClient().get<{ report: string }>(`/report/remessa/${id}`)
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

onMounted(() => remessaStore.fetchRemessas())
</script>

<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        variant="elevated"
        color="primary"
        text="Gerar relatório"
        :append-icon="icon"
      />
    </template>

    <v-list>
      <v-list-item
        v-for="({ id, descricao }) in remessaStore.remessas"
        :key="id"
      >
        <v-list-item-title @click="generateReport(id)">
          {{ descricao }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<style scoped>
.v-card-actions {
  justify-content: flex-end;
}
</style>
