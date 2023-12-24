<script setup lang="ts">
import { computed } from 'vue'
import { useCamisaStore } from '@/stores/camisa'
import { useRemessaStore } from '@/stores/remessa'

defineProps<{
  search: string,
  loading: string | boolean
}>()

const emit = defineEmits<{
  (e: 'edit', id: string): void,
  (e: 'delete', id: string): void
}>()

const camisaStore = useCamisaStore()
const remessaStore = useRemessaStore()

const remessaDescricao = computed(() => remessaStore.remessaAberta?.descricao ?? '')

const HEADERS = [
  {
    title: 'Nome',
    value: 'nomePessoa',
    sortable: false
  },
  {
    title: 'Camisa',
    key: 'camisa',
    sortable: false,
  },
  {
    key: 'actions',
    sortable: false,
  }
]
</script>

<template>
  <v-data-table
    :items="camisaStore.camisas"
    :headers="HEADERS"
    :search="search"
    :loading="loading"
    loading-text="Carregando..."
    no-data-text="Nenhum pedido registrado"
    items-per-page="-1"
    fixed-header
  >
    <template v-slot:item.camisa="{ item }">
      <p>{{ item.modeloDescricao }}</p>
      <p>{{ item.tamanhoDescricao }}</p>
    </template>

    <template v-slot:item.actions="{ item }">
      <v-menu location="bottom">
        <template v-slot:activator="{ props }">
          <v-btn
            variant="text"
            icon="mdi-dots-vertical"
            v-bind="props"
          />
        </template>

        <v-list>
          <v-list-item
            append-icon="mdi-pencil"
            title="Editar"
            @click="emit('edit', item.id)"
          />
          <v-list-item
            append-icon="mdi-delete"
            title="Excluir"
            class="delete-button"
            @click="emit('delete', item.id)"
          />
        </v-list>
      </v-menu>
    </template>

    <template v-slot:bottom>
      <div class="table-footer-container" v-if="!loading && remessaStore.remessaAberta">
        <div>
          <p>{{ remessaDescricao }}</p>
          <p>Total de pedidos: {{ camisaStore.camisas.length }}</p>
        </div>
        <div>
          <p>Data limite:</p>
          <p>{{ remessaStore.dataLimite }}</p>
        </div>
      </div>
    </template>
  </v-data-table>
</template>

<style scoped lang="scss">
.v-table {
  height: calc(100% - 40px);

  :deep(.v-data-table__tr .v-data-table__td):last-child {
    text-align: end;
  }
}

.table-footer-container {
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  padding: 8px 0 0;
  display: flex;
  justify-content: space-between;
}

.delete-button {
  color: red;
}
</style>
