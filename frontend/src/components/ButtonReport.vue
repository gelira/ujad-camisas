<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  apiFetchListingCamisasReport,
  apiFetchCountingCamisasReport,
} from '@/api/reports'

import { useAuthStore } from '@/stores/auth'
import { useRemessaStore } from '@/stores/remessa'
import { useSetorStore } from '@/stores/setor'

type IconRef = 'mdi-file-pdf-box' | 'mdi-loading mdi-spin'
type ReportType = 'counting' | 'listing'

const authStore = useAuthStore()
const remessaStore = useRemessaStore()
const setorStore = useSetorStore()

const countingIcon = ref<IconRef>('mdi-file-pdf-box')
const listingIcon = ref<IconRef>('mdi-file-pdf-box')

function generateReport(reportType: ReportType, id?: string) {
  const apiCall = reportType === 'counting'
    ? apiFetchCountingCamisasReport
    : apiFetchListingCamisasReport

  const icon = reportType === 'counting' ? countingIcon : listingIcon

  icon.value = 'mdi-loading mdi-spin'
  
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
    .finally(() => {
      icon.value = 'mdi-file-pdf-box'
    })
}

onMounted(() => {
  remessaStore.fetchRemessas()
  setorStore.fetchSetores()
})
</script>

<template>
  <div class="container">
    <v-menu v-if="authStore.admin">
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          variant="elevated"
          color="primary"
          text="Gerar relatório de contagem de pedidos"
          :append-icon="countingIcon"
        />
      </template>
  
      <v-list>
        <v-list-item
          title="Geral"
          @click="generateReport('counting')"
        />
        <v-list-item
          v-for="({ id, descricao }) in remessaStore.remessas"
          :key="id"
          :title="descricao"
          @click="generateReport('counting', id)"
        />
      </v-list>
    </v-menu>
  
    <v-menu>
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          variant="elevated"
          color="primary"
          text="Gerar relatório de lista de pedidos"
          :append-icon="listingIcon"
        />
      </template>
  
      <v-list>
        <v-list-item
          title="Geral"
          v-if="authStore.admin"
          @click="generateReport('listing')"
        />
        <v-list-item
          v-for="({ id, nome }) in setorStore.setores"
          :key="id"
          :title="nome"
          @click="generateReport('listing', id)"
        />
      </v-list>
    </v-menu>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
}

.v-card-actions {
  justify-content: flex-end;
}
</style>
