<script setup lang="ts">
import { useDisplay } from 'vuetify'
import { useCamisaStore } from '@/stores/camisa'

defineProps<{
  search: string,
  loading: string | boolean
}>()

const emit = defineEmits<{
  (e: 'edit', id: string): void,
  (e: 'delete', id: string): void
}>()

const { mobile } = useDisplay()

const camisaStore = useCamisaStore()

const headers = [
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

const pageOptions = [
  {
    value: 10,
    title: '10'
  },
  {
    value: 25,
    title: '25'
  },
  {
    value: 50,
    title: '50'
  },
  {
    value: 100,
    title: '100'
  },
  {
    value: -1,
    title: 'Todos'
  }
]
</script>

<template>
  <v-data-table
    :items="camisaStore.camisas"
    :headers="headers"
    :search="search"
    :items-per-page-options="pageOptions"
    :loading="loading"
    :class="{ mobile }"
    loading-text="Carregando..."
    no-data-text="Nenhum pedido registrado"
    items-per-page-text="Itens por página"
    page-text="{0}-{1} de {2}"
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
  </v-data-table>
</template>

<style scoped lang="scss">
.v-table {
  height: calc(100% - 40px);

  :deep(.v-data-table__tr .v-data-table__td):last-child {
    text-align: end;
  }

  :deep(.v-data-table-footer) {
    border-top: 1px solid rgba(0, 0, 0, 0.12);
  }

  &.mobile {
    :deep(.v-data-table-footer) {
      justify-content: center;
      padding-top: 8px;
    }

    :deep(.v-data-table-footer__items-per-page) {
      width: 100%;
      padding: 0;
    }
  }
}

.delete-button {
  color: red;
}
</style>
