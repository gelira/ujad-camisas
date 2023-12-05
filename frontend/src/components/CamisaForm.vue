<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { VForm } from 'vuetify/components/VForm'

import { useCamisaStore } from '@/stores/camisa'
import { useModeloStore } from '@/stores/modelo'
import { useTamanhoStore } from '@/stores/tamanho'
import { useAlertStore } from '@/stores/alert'

interface State {
  nomePessoa: string
  modeloId: string | null
  tamanhoId: string | null
  totalPago: number
  loading: string | boolean
}

const props = defineProps<{ camisaId: string, open: boolean }>()
const emit = defineEmits<{ (e: 'close'): void }>()
const state = reactive<State>({
  nomePessoa: '',
  modeloId: null,
  tamanhoId: null,
  totalPago: 0,
  loading: false
})

const camisaStore = useCamisaStore()
const modeloStore = useModeloStore()
const tamanhoStore = useTamanhoStore()
const alertStore = useAlertStore()

const route = useRoute()
const form = ref<VForm>()

const title = computed(
  () => props.camisaId ? 'Atualizar pedido' : 'Novo pedido'
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

  const { valid } = await form.value.validate()

  if (!valid) {
    return
  }

  state.loading = 'primary'

  const payload = {
    nomePessoa: state.nomePessoa,
    modeloId: state.modeloId as string,
    tamanhoId: state.tamanhoId as string,
    totalPago: state.totalPago
  }

  const setorId = route.params.id as string

  try {
    if (props.camisaId) {
      await camisaStore.updateCamisa(props.camisaId, payload)
    } else {
      await camisaStore.createCamisa({ ...payload, setorId })
    }

    await camisaStore.fetchCamisas(setorId)
    emit('close')
  } catch {
    alertStore.showAlert('Não foi possível salvar as informações. Tente novamente.')
  } finally {
    state.loading = false
  }
}

watch(
  () => props.camisaId,
  (value) => {
    const camisa = camisaStore.findById(value)

    state.nomePessoa = camisa?.nomePessoa ?? ''
    state.modeloId = camisa?.modeloId ?? null
    state.tamanhoId = camisa?.tamanhoId ?? null
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
    <v-card :loading="state.loading">
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
