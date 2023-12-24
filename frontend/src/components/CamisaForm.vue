<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { VForm } from 'vuetify/components/VForm'

import { useCamisaStore } from '@/stores/camisa'
import { useModeloStore } from '@/stores/modelo'
import { useTamanhoStore } from '@/stores/tamanho'
import { useAlertStore } from '@/stores/alert'
import { useRemessaStore } from '@/stores/remessa'

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
const remessaStore = useRemessaStore()

const route = useRoute()
const form = ref<VForm>()

const title = computed(
  () => props.camisaId ? 'Atualizar pedido' : 'Novo pedido'
)

const remessaId = computed(() => remessaStore.remessaAberta?.id ?? '')

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
    remessaId: remessaId.value,
    totalPago: state.totalPago
  }

  const setorId = route.params.id as string

  try {
    if (props.camisaId) {
      await camisaStore.updateCamisa(props.camisaId, payload)
    } else {
      await camisaStore.createCamisa({ ...payload, setorId })
    }

    await camisaStore.fetchCamisas(setorId, remessaId.value)
    emit('close')
    resetForm()
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
    <v-card :loading="state.loading" :title="title">
      <v-card-text>
        <v-form ref="form">
          <v-text-field
            v-model="state.nomePessoa"
            label="Nome da pessoa"
            variant="outlined"
          />

          <v-select
            v-model="state.modeloId"
            :items="modeloStore.modelos"
            item-value="id"
            item-title="descricao"
            label="Modelo"
            variant="outlined"
            :rules="[v => !!v || 'Campo obrigatório']"
          />

          <v-select
            v-model="state.tamanhoId"
            :items="tamanhoStore.tamanhos"
            item-value="id"
            item-title="descricao"
            label="Tamanho"
            variant="outlined"
            :rules="[v => !!v || 'Campo obrigatório']"
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn
          variant="elevated"
          color="primary"
          text="Cancelar"
          @click="resetForm"
        />
        <v-btn
          variant="elevated"
          color="success"
          text="Salvar"
          @click="submit"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.v-card-actions {
  justify-content: flex-end;
}

@media screen and (min-width: 64em) {
  .v-card {
    width: 70%;
  }

  .v-overlay :deep(.v-overlay__content) {
    align-items: center;
  }
}
</style>
