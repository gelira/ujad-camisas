import { apiClient } from './client'

export function fetchTamanhos() {
  return apiClient().get<{ tamanhos: Tamanho[] }>('/tamanho/list')
}
