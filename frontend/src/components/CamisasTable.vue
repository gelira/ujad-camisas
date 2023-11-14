<script setup lang="ts">
import { useCamisas } from '@/composables/camisa'

const { camisas } = useCamisas()

const headers = [
  {
    title: 'Nome',
    value: 'nomePessoa',
    align: 'start',
    sortable: false
  },
  {
    title: 'Camisa',
    key: 'camisa',
    align: 'start',
    sortable: false,
  },
  {
    key: 'actions',
    align: 'end',
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
    :items="camisas"
    :headers="headers"
    :items-per-page-options="pageOptions"
    items-per-page-text="Itens por página"
    page-text="{0}-{1} de {2}"
  >
    <template v-slot:item.camisa="{ item }">
      <p>{{ item.modeloDescricao }}</p>
      <p>({{ item.tamanhoDescricao }})</p>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-menu location="bottom">
        <template v-slot:activator="{ props }">
          <v-btn
            variant="text"
            icon="mdi-dots-vertical"
            v-bind="props"
          ></v-btn>
        </template>

        <v-list>
          <v-list-item>
            <template v-slot:append>
              <v-icon icon="mdi-pencil"></v-icon>
            </template>
            <v-list-item-title>Editar</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <template v-slot:append>
              <v-icon icon="mdi-delete"></v-icon>
            </template>
            <v-list-item-title>Deletar</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </template>
  </v-data-table>
</template>
