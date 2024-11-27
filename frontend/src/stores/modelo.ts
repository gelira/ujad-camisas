import { computed, reactive } from 'vue'
import { defineStore } from 'pinia'

import { apiFetchModelos } from '@/api/modelo'

interface State {
  modelos: Modelo[]
}

export const useModeloStore = defineStore('modelo', () => {
  const state = reactive<State>({ modelos: [] })

  const modelos = computed(() => state.modelos)

  const fetchModelos = async () => {
    const { data } = await apiFetchModelos()
    state.modelos = data.modelos
  }

  return {
    modelos,
    fetchModelos
  }
})