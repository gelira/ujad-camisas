import { computed, reactive } from 'vue'
import { defineStore } from 'pinia'

import { apiFetchCamisas, apiCreateCamisa, apiUpdateCamisa, apiDeleteCamisa } from '@/api/camisa'

interface State {
  camisas: Camisa[]
}

export const useCamisaStore = defineStore('camisa', () => {
  const state = reactive<State>({ camisas: [] })

  const camisas = computed(() => state.camisas)

  const fetchCamisas = async (setorId: string) => {
    const { data } = await apiFetchCamisas(setorId)
    state.camisas = data.camisas
  }

  const findById = (id: string) => state.camisas.find(i => i.id === id) ?? null

  const createCamisa = async (data: CreateCamisa) => {
    await apiCreateCamisa(data)
  }

  const updateCamisa = async (id: string, data: UpdateCamisa) => {
    await apiUpdateCamisa(id, data)
  }

  const deleteCamisa = async (id: string) => {
    await apiDeleteCamisa(id)
    state.camisas = state.camisas.filter(i => i.id !== id)
  }

  return {
    state,
    camisas,
    fetchCamisas,
    findById,
    createCamisa,
    updateCamisa,
    deleteCamisa,
  }
})