<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { apiClient } from '@/api/client'
import { useRemessaStore } from '@/stores/remessa'

type IconRef = 'mdi-file-pdf-box' | 'mdi-loading mdi-spin'

const remessaStore = useRemessaStore()

const icon = ref<IconRef>('mdi-file-pdf-box')

function generateReport(remessaId?: string) {
  icon.value = 'mdi-loading mdi-spin'
  apiClient().get<{ report: string }>('/report/pedidos-camisas', {
    params: { remessaId },
  })
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
        title="Geral"
        @click="generateReport()"
      />
      <v-list-item
        v-for="({ id, descricao }) in remessaStore.remessas"
        :key="id"
        :title="descricao"
        @click="generateReport(id)"
      />
    </v-list>
  </v-menu>
</template>

<style scoped>
.v-card-actions {
  justify-content: flex-end;
}
</style>
