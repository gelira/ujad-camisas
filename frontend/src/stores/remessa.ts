import { computed, reactive } from 'vue'
import { defineStore } from 'pinia'

import { apiFetchRemessaAberta } from '@/api/remessa'

interface State {
  remessaAberta: Remessa | null
}

export const useRemessaStore = defineStore('remessa', () => {
  const state = reactive<State>({ remessaAberta: null })

  const remessaAberta = computed(() => state.remessaAberta)

  const dataLimite = computed(() => {
    if (state.remessaAberta?.abertoManual) {
      return 'Aberta manualmente'
    }

    if (!state.remessaAberta?.final) {
      return null
    }

    const dt = new Date(state.remessaAberta.final)

    if (isNaN(dt.getTime())) {
      return null
    }

    const dtShow = new Date(dt.getTime() - 60 * 1000)

    const year = dtShow.getFullYear()
    const month = (dtShow.getMonth() + 1).toString().padStart(2, '0')
    const day = dtShow.getDate().toString().padStart(2, '0')
    const hour = dtShow.getHours().toString().padStart(2, '0')
    const minute = dtShow.getMinutes().toString().padStart(2, '0')

    return `${day}/${month}/${year} ${hour}:${minute}`
  })

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
    dataLimite,
    fetchRemessaAberta,
  }
})