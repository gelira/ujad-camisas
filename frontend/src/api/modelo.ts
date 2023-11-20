import { apiClient } from './client'

export function fetchModelos() {
  return apiClient().get<{ modelos: Modelo[] }>('/modelo/list')
}
