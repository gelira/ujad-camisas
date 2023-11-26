import { computed, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { defineStore } from 'pinia'

import { apiFetchSetores } from '@/api/setor'

interface State {
  setores: Setor[]
}

export const useSetorStore = defineStore('setor', () => {
  const state = reactive<State>({ setores: [] })
  const route = useRoute()

  const setores = computed(() => state.setores)

  const setorSelected = computed(() => {
    const setorId = route.params.id as string
    return state.setores.find(i => i.id === setorId)
  })

  const fetchSetores = async () => {
    const { data } = await apiFetchSetores()
    state.setores = data.setores
  }

  return {
    state,
    setores,
    setorSelected,
    fetchSetores
  }
})