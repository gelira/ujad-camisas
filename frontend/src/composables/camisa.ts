import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

import { apiClient } from '@/api'

interface Camisa {
  id: string
  nomePessoa: string
  modeloId: string
  modeloDescricao: string
  modeloValor: number
  totalPago: number
  tamanhoId: string
  tamanhoDescricao: string
}

interface CamisaData {
  camisas: Camisa[]
}

export function useCamisas() {
  const camisas = ref<Camisa[]>([])
  const route = useRoute()

  watch(
    () => route.params.id,
    (setorId) => {
      apiClient().get<CamisaData>('/camisa/list', { params: { setorId } })
        .then(({ data }) => camisas.value = data.camisas)
        .catch(() => camisas.value = [])
    },
    { immediate: true }
  )

  return { camisas }
}