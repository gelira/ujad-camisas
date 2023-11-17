import { apiClient } from './client'

export interface Modelo {
  id: string
  descricao: string
  valor: number
}

export function fetchModelos() {
  return apiClient().get<{
    modelos: Modelo[]
  }>('/modelo/list')
}
