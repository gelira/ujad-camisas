import { apiClient } from './client'

export function fetchSetores() {
  return apiClient().get<{ setores: Setor[] }>('/setor/list')
}
