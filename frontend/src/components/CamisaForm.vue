<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { VForm } from 'vuetify/components/VForm'

import { useModeloStore } from '@/stores/modelo'
import { useTamanhoStore } from '@/stores/tamanho'
import { createCamisa, updateCamisa } from '@/api/camisa'

interface State {
  nomePessoa: string
  modeloId: string | null
  tamanhoId: string | null
  totalPago: number
}

const props = defineProps<{ camisa: Camisa | null, open: boolean }>()
const emit = defineEmits<{ (e: 'close'): void, (e: 'saved'): void }>()
const state = reactive<State>({
  nomePessoa: '',
  modeloId: null,
  tamanhoId: null,
  totalPago: 0,
})

const modeloStore = useModeloStore()
const tamanhoStore = useTamanhoStore()

const route = useRoute()
const form = ref<VForm>()

const title = computed(
  () => props.camisa ? 'Atualizar pedido de camisa' : 'Criar pedido de camisa'
)

const resetForm = () => {
  state.nomePessoa = ''
  state.modeloId = null
  state.tamanhoId = null
  state.totalPago = 0
  emit('close')
}

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
  modeloStore.fetchModelos()
    .catch(() => {})

  tamanhoStore.fetchTamanhos()
    .catch(() => {})
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
            :items="modeloStore.modelos"
            item-value="id"
            item-title="descricao"
            label="Modelo"
            variant="outlined"
            :rules="[v => !!v || 'Campo obrigatório']"
          ></v-select>

          <v-select
            v-model="state.tamanhoId"
            :items="tamanhoStore.tamanhos"
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
          @click="resetForm"
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
