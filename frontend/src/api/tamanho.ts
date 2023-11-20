import { apiClient } from './client'

export function apiFetchTamanhos() {
  return apiClient().get<{ tamanhos: Tamanho[] }>('/tamanho/list')
}
