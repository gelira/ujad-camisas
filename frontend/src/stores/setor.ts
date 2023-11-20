import { computed, reactive } from 'vue'
import { defineStore } from 'pinia'

import { apiFetchSetores } from '@/api/setor'

interface State {
  setores: Setor[]
}

export const useSetorStore = defineStore('setor', () => {
  const state = reactive<State>({ setores: [] })

  const setores = computed(() => state.setores)

  const fetchSetores = async () => {
    const { data } = await apiFetchSetores()
    state.setores = data.setores
  }

  return {
    state,
    setores,
    fetchSetores
  }
})