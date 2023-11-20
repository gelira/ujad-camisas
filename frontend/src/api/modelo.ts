import { apiClient } from './client'

export function apiFetchModelos() {
  return apiClient().get<{ modelos: Modelo[] }>('/modelo/list')
}
