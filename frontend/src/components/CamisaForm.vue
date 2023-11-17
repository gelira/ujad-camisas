<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { VForm } from 'vuetify/components/VForm'

import { createCamisa, updateCamisa, type Camisa } from '@/api/camisa'
import { fetchModelos, type Modelo } from '@/api/modelo'
import { fetchTamanhos, type Tamanho } from '@/api/tamanho'

interface State {
  nomePessoa: string
  modeloId: string | null
  tamanhoId: string | null
  totalPago: number
  modelos: Modelo[]
  tamanhos: Tamanho[]
}

const props = defineProps<{ camisa: Camisa | null, open: boolean }>()
const emit = defineEmits<{ (e: 'close'): void, (e: 'saved'): void }>()
const state = reactive<State>({
  nomePessoa: '',
  modeloId: null,
  tamanhoId: null,
  totalPago: 0,
  modelos: [],
  tamanhos: []
})

const route = useRoute()
const form = ref<VForm>()

const title = computed(
  () => props.camisa ? 'Atualizar pedido de camisa' : 'Criar pedido de camisa'
)

const submit = async () => {
  if (!form.value) {
    return
  }

  try {
    const { valid } = await form.value.validate()
  
    if (!valid) {
      return
    }
  
    const payload = {
      nomePessoa: state.nomePessoa,
      modeloId: state.modeloId as string,
      tamanhoId: state.tamanhoId as string,
      totalPago: state.totalPago
    }

    if (props.camisa) {
      await updateCamisa(props.camisa.id, payload)
    } else {
      await createCamisa({ ...payload, setorId: route.params.id as string })
    }

    emit('saved')
  } catch {
    // do nothing
  }
}

watch(
  () => props.camisa,
  (value) => {
    state.nomePessoa = value?.nomePessoa ?? ''
    state.modeloId = value?.modeloId ?? null
    state.tamanhoId = value?.tamanhoId ?? null
  },
  { immediate: true }
)

onMounted(() => {
  fetchModelos()
    .then(({ data }) => state.modelos = data.modelos)
    .catch(() => state.modelos = [])

  fetchTamanhos()
    .then(({ data }) => state.tamanhos = data.tamanhos)
    .catch(() => state.tamanhos = [])
})
</script>

<template>
  <v-dialog v-model="props.open" persistent>
    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-text-field
            v-model="state.nomePessoa"
            label="Nome da pessoa"
            variant="outlined"
          ></v-text-field>

          <v-select
            v-model="state.modeloId"
            :items="state.modelos"
            item-value="id"
            item-title="descricao"
            label="Modelo"
            variant="outlined"
            :rules="[v => !!v || 'Campo obrigatório']"
          ></v-select>

          <v-select
            v-model="state.tamanhoId"
            :items="state.tamanhos"
            item-value="id"
            item-title="descricao"
            label="Tamanho"
            variant="outlined"
            :rules="[v => !!v || 'Campo obrigatório']"
          ></v-select>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn
          variant="elevated"
          color="primary"
          @click="emit('close')"
        >Cancelar</v-btn>
        <v-btn
          variant="elevated"
          color="success"
          @click="submit"
        >Salvar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.v-card-actions {
  justify-content: flex-end;
}
</style>
