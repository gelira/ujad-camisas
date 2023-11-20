import { apiClient } from './client'

export function apiFetchSetores() {
  return apiClient().get<{ setores: Setor[] }>('/setor/list')
}
