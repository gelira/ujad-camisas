<script setup lang="ts">
import {
  apiFetchCountingCamisasReport,
  apiFetchListingCamisasReport,
} from '@/api/reports';
import { computed } from 'vue';

import { useRemessaStore } from '@/stores/remessa';
import { useSetorStore } from '@/stores/setor';
import GerarRelatorioDialog from './GerarRelatorioDialog.vue';

const setorStore = useSetorStore()
const remessaStore = useRemessaStore()

const listRemessasComputed = computed(
  () => remessaStore.remessas.map(({ id, descricao: label }) => ({ id, label }))
)

const listSetoresComputed = computed(
  () => setorStore.setores.map(({ id, nome: label }) => ({ id, label }))
)

function generateReport(reportType: 'counting' | 'listing', id?: string) {
  const apiCall = {
    counting: apiFetchCountingCamisasReport,
    listing: apiFetchListingCamisasReport,
  }[reportType]
  
  apiCall(id)
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
    .finally(() => {})
}
</script>

<template>
  <GerarRelatorioDialog
    title="Gerar relatório - Contagem de pedidos"
    subtitle="Selecione a remessa"
    :listValues="listRemessasComputed"
    @generate="generateReport('counting', $event)"
  >
    <template v-slot="{ openDialog }">
      <v-list-item
        title="Contagem de pedidos"
        append-icon="mdi-clipboard-list-outline"
        @click="openDialog"
      />
    </template>
  </GerarRelatorioDialog>
  <v-divider />
  <GerarRelatorioDialog
    title="Gerar relatório - Lista de camisas"
    subtitle="Selecione o setor"
    :listValues="listSetoresComputed"
    @generate="generateReport('listing', $event)"
  >
    <template v-slot="{ openDialog }">
      <v-list-item
        title="Lista de camisas"
        append-icon="mdi-clipboard-text-outline"
        @click="openDialog"
      />
    </template>
  </GerarRelatorioDialog>
</template>