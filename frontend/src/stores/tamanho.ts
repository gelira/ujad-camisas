import { computed, reactive } from 'vue'
import { defineStore } from 'pinia'

import { apiFetchTamanhos } from '@/api/tamanho'

interface State {
  tamanhos: Tamanho[]
}

export const useTamanhoStore = defineStore('tamanho', () => {
  const state = reactive<State>({ tamanhos: [] })

  const tamanhos = computed(() => state.tamanhos)

  const fetchTamanhos = async () => {
    const { data } = await apiFetchTamanhos()
    state.tamanhos = data.tamanhos
  }

  return {
    state,
    tamanhos,
    fetchTamanhos
  }
})
