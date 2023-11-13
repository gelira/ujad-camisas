import { ref, onMounted } from 'vue'

import { apiClient } from '@/api'

interface Setor {
  id: string
  nome: string
}

interface SetorData {
  setores: Setor[]
}

export function useSetores() {
  const setores = ref<Setor[]>([])
  
  onMounted(() => {
    apiClient().get<SetorData>('/setor/list')
      .then(({ data }) => setores.value = data.setores)
      .catch(() => {})
  })

  return { setores }
}