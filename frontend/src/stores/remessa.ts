import { computed, reactive } from 'vue'
import { defineStore } from 'pinia'

import { apiFetchRemessaAberta } from '@/api/remessa'

interface State {
  remessaAberta: Remessa | null
}

export const useRemessaStore = defineStore('remessa', () => {
  const state = reactive<State>({ remessaAberta: null })

  const remessaAberta = computed(() => state.remessaAberta)

  const fetchRemessaAberta = async () => {
    try {
      const { data } = await apiFetchRemessaAberta()
      state.remessaAberta = data.remessa
    } catch {
      state.remessaAberta = null
    }
  }

  return {
    state,
    remessaAberta,
    fetchRemessaAberta,
  }
})