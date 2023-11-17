import { apiClient } from './client'

export interface Tamanho {
  id: string
  descricao: string
}

export function fetchTamanhos() {
  return apiClient().get<{
    tamanhos: Tamanho[]
  }>('/tamanho/list')
}
